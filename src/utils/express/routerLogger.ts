import { Express } from 'express';
import chalk from 'chalk';

interface RouteInfo {
  method: string;
  path: string;
}

export function routerLogger(app: Express): void {
  const routes: RouteInfo[] = [];

  function extractRoutes(stack: any[], prefix = '') {
    for (const layer of stack) {
      // Se for uma rota direta
      if (layer.route && layer.route.path) {
        const routePath = prefix + layer.route.path;
        const methods = Object.keys(layer.route.methods || {}).map((m) =>
          m.toUpperCase(),
        );

        methods.forEach((method) => {
          routes.push({ method, path: routePath });
        });
      }

      // Se for um router montado (app.use)
      else if (layer.name === 'router' && layer.handle?.stack) {
        // Montar o prefixo a partir do RegExp se possível
        const pathFromRegexp =
          layer.regexp?.source
            ?.replace('^\\/', '/')
            .replace('\\/?(?=\\/|$)', '')
            .replace(/\\\//g, '/') || '';

        extractRoutes(layer.handle.stack, prefix + pathFromRegexp);
      }
    }
  }

  const appRouter = (app as any).router || (app as any)._router;

  if (!appRouter?.stack) {
    console.log(chalk.red('No registered routes found.'));
    return;
  }

  extractRoutes(appRouter.stack);

  console.log(chalk.bold.yellow('\nRegistered routes:\n'));

  if (routes.length === 0) {
    console.log(chalk.red('No registered routes.'));
    return;
  }

  const maxMethod = Math.max(...routes.map((r) => r.method.length));
  const maxPath = Math.max(...routes.map((r) => r.path.length));

  console.log(
    chalk.bold.gray(
      `  ${'Method'.padEnd(maxMethod)} | ${'Path'.padEnd(maxPath)}`,
    ),
  );
  console.log(
    chalk.gray(`  ${'-'.repeat(maxMethod)}-|-${'-'.repeat(maxPath)}`),
  );

  for (const route of routes) {
    const color =
      {
        GET: chalk.blue,
        POST: chalk.green,
        PUT: chalk.magenta,
        DELETE: chalk.red,
        PATCH: chalk.cyan,
      }[route.method] || chalk.white;

    console.log(
      `  ${color(route.method.padEnd(maxMethod))} | ${chalk.white(route.path)}`,
    );
  }

  console.log();
}

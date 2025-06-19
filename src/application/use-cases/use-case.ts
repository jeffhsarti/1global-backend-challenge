export interface UseCase<R, A = void> {
  execute(args: A extends void ? void : A): Promise<R>;
}

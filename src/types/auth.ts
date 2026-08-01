export interface AuthActionState {
    success: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}
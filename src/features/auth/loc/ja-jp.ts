import { jaJP } from '@clerk/localizations'

export const customLocalization = {
  ...jaJP,
  signIn: {
    ...jaJP.signIn,
    start: {
      ...jaJP.signIn?.start,
      actionLink: "新規登録"
    }
  },
  signUp: {
    ...jaJP.signUp,
    start: {
      ...jaJP.signUp?.start,
      actionText: "アカウントをすでにお持ちの場合は",
      title: 'アカウントを作成',
      subtitle: '{{applicationName}} へようこそ',
    },
  },
  formFieldInputPlaceholder__signUpPassword: '新しいパスワードを入力',
}

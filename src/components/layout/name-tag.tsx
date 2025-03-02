import userStore from '../../lib/store/user-store.ts';

export function NameTag() {
  const { user_name } = userStore();
  return (
    <div className={'flex flex-row content-center'}>
      <p className={'text-lg'}>Welcome {user_name}</p>
    </div>
  );
}

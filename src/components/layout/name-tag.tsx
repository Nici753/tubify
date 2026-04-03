import userStore from '../../lib/store/user-store.ts';

export function NameTag() {
  const { user_name, user_picture } = userStore();
  return (
    <div className={'flex flex-row content-center'}>
      {user_picture && (
        <img
          className="h-12 px-2 py-2 object-cover rounded-lg"
          src={user_picture}
          alt="Profile picture"
        />
      )}
      <p className={'text-lg content-center'}>Welcome {user_name}</p>
    </div>
  );
}

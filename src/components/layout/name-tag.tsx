export function NameTag() {
  const user: string = localStorage.getItem('user_name');
  return (
    <div className={'flex flex-row content-center'}>
      <p className={'text-lg'}>Welcome {user}</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
    return (
      <div className='w-full max-w-xl mx-auto p-4'>
        <div role='alert' className='rounded-md border border-red-200 bg-red-50 p-3 text-red-700'>
          {message}
        </div>
      </div>
    )
}
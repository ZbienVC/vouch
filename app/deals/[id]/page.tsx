export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="flex items-center justify-center h-full min-h-screen bg-[#0A0A0F]">
      <div className="text-center space-y-3">
        <h2 className="font-sans text-2xl font-bold text-white">
          Deal
        </h2>
        <p className="text-[#8888AA]">Deal ID: {id}</p>
        <p className="text-[#8888AA] text-sm">Deal details coming in the next phase.</p>
      </div>
    </div>
  )
}
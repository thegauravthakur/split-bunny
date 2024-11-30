export default async function Page() {
    await new Promise((res) => setTimeout(res, 2000))
    return (
        <div className="text-center mt-40">
            <p>Members</p>
        </div>
    )
}

import TechTree from '../components/TechTree';

export default function TechTreePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <h1 className="text-4xl font-bold mb-8">Certification Tech Tree</h1>
            </div>
            <div className="w-full h-screen border rounded-lg overflow-hidden">
                <TechTree />
            </div>
        </main>
    );
}

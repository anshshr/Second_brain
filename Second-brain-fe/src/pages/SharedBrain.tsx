import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import BACKEND_URL from '../confg';
import axios from 'axios';

interface SharedBrainItem {
    _id: string;
    title: string;
    link: string;
    tags: string[];
    type: 'image' | 'audio' | 'video' | 'article' | string;
}

interface SharedBrainResponse {
    username: string;
    userData: SharedBrainItem[];
}

const iconByType: Record<string, string> = {
    image: '🖼️',
    audio: '🎵',
    video: '🎥',
    article: '📄',
};

const accentByType: Record<string, string> = {
    image: 'from-pink-500 to-orange-500',
    audio: 'from-emerald-500 to-teal-500',
    video: 'from-rose-500 to-red-500',
    article: 'from-sky-500 to-indigo-500',
};

const SharedBrain = () => {
    const { username } = useParams();
    const [owner, setOwner] = useState<string>('');
    const [items, setItems] = useState<SharedBrainItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchSharedBrain = async () => {
            if (!username) {
                setError('Invalid share link');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const response = await axios.get(`${BACKEND_URL}/brain/${encodeURIComponent(username)}`);
                if (!response.data) {
                    if (response.status === 404) {
                        throw new Error('This shared brain does not exist.');
                    }
                    throw new Error('Failed to load shared brain');
                }

                const data: SharedBrainResponse = await response.data;
                setOwner(data.username);
                setItems(data.userData || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unable to load content');
            } finally {
                setLoading(false);
            }
        };

        fetchSharedBrain();
    }, [username]);

    const groupedByType = useMemo(() => {
        return items.reduce<Record<string, SharedBrainItem[]>>((acc, item) => {
            const key = item.type || 'other';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    }, [items]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-cyan-300 border-t-transparent animate-spin" />
                    <p className="text-slate-300">Loading shared brain...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
                <div className="max-w-lg w-full rounded-2xl bg-slate-900/80 border border-slate-700 p-8 text-center">
                    <h1 className="text-2xl font-bold mb-3">Shared Brain Unavailable</h1>
                    <p className="text-slate-300">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
                <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-rose-500/15 blur-3xl" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                <header className="mb-10 rounded-3xl border border-slate-700/70 bg-slate-900/60 p-8 backdrop-blur">
                    <p className="uppercase tracking-[0.2em] text-xs text-cyan-300 mb-2">Public Brain Snapshot</p>
                    <h1 className="text-4xl md:text-5xl font-black leading-tight">
                        {owner}'s Knowledge Garden
                    </h1>
                    <p className="mt-3 text-slate-300 text-lg">
                        {items.length} saved resource{items.length !== 1 ? 's' : ''} organized by content type.
                    </p>
                </header>

                {items.length === 0 ? (
                    <section className="rounded-3xl border border-slate-700 bg-slate-900/70 p-10 text-center">
                        <p className="text-5xl mb-3">🌱</p>
                        <h2 className="text-2xl font-bold mb-2">No content shared yet</h2>
                        <p className="text-slate-300">This brain is public, but currently empty.</p>
                    </section>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedByType).map(([type, typeItems]) => (
                            <section key={type}>
                                <div className={`inline-flex items-center gap-3 rounded-full bg-gradient-to-r ${accentByType[type] || 'from-slate-600 to-slate-500'} px-5 py-2 text-sm font-semibold text-white mb-4`}>
                                    <span>{iconByType[type] || '🔗'}</span>
                                    <span className="capitalize">{type}</span>
                                    <span className="opacity-80">({typeItems.length})</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {typeItems.map((item, idx) => (
                                        <article
                                            key={item._id}
                                            className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5 shadow-lg hover:-translate-y-1 hover:border-slate-500 transition-all duration-200"
                                            style={{ animationDelay: `${idx * 70}ms` }}
                                        >
                                            <h3 className="text-lg font-bold mb-2 line-clamp-2">{item.title}</h3>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-300 hover:text-cyan-200 underline underline-offset-4 break-all text-sm"
                                            >
                                                Open Resource
                                            </a>

                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {item.tags.length > 0 ? (
                                                    item.tags.map((tag) => (
                                                        <span
                                                            key={`${item._id}-${tag}`}
                                                            className="text-xs px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-slate-400">No tags</span>
                                                )}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SharedBrain;

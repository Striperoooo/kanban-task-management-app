import React from 'react'

type Props = { children: React.ReactNode }

export default class ErrorBoundary extends React.Component<Props, { hasError: boolean, error?: Error, info?: any }> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, info: any) {
        // log for debugging; leave room for integrating remote logging later
        console.error('[ErrorBoundary] caught error', error, info)
        this.setState({ hasError: true, error, info })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 text-red-700">
                    <h3 className="font-bold mb-2">Something went wrong inside the DnD layer.</h3>
                    <pre className="text-xs whitespace-pre-wrap">{String(this.state.error)}</pre>
                </div>
            )
        }
        return this.props.children
    }
}

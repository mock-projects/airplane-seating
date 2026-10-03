import type {Metadata, Viewport} from 'next'
import {Roboto} from 'next/font/google'
import type {ReactNode} from 'react'
import '../styles/app.css'

const roboto = Roboto({
	weight: ['400', '500', '700'],
	subsets: ['latin'],
	display: 'swap',
})

const metadata: Metadata = {
	title: 'Flights Dash',
	description: 'Flights Dash Assessment',
	icons: {
		icon: 'https://storage.googleapis.com/bb-logos/bb-icon.png',
	},
}

const viewport: Viewport = {
	themeColor: '#000000',
}

const RootLayout = ({
	children,
}: Readonly<{children: ReactNode}>) => {
	return (
		<html lang='en'>
			<body className={roboto.className}>{children}</body>
		</html>
	)
}

export {metadata, viewport}
export default RootLayout

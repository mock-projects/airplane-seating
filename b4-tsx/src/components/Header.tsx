import {viewOptions} from '../types/constants.mts'
import {Dropdown} from './Dropdown.tsx'

interface HeaderProps {
	viewId: number
	setViewId: (viewId: number) => void
}

/**
 * Renders a header element.
 */
const Header = ({viewId, setViewId}: HeaderProps) => {
	const onResetClick = ( ) => {
		setViewId(0)
	}

	return (
		<header>
			<h1 className='company-title'>Flight Dashboard</h1>
			<div className='menu-container'>
				<Dropdown
					value={viewId}
					setSelected={setViewId}
					label='View'
					options={viewOptions}
				/>
				<button onClick={onResetClick}>Reset</button>
			</div>
		</header>
	)
}

export {Header}

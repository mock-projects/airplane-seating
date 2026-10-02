import type {ChangeEvent} from 'react'

interface DropdownProps {
	options: string[ ]
	label: string
	value: number
	setSelected: (selectedValue: number) => void
}

/**
 * Renders a dropdown component.
 */
const Dropdown = ({options, label, value, setSelected}: DropdownProps) => {
	const onChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelected(parseInt(e.target.value))
	}
	return (
		<div className='dropdown'>
			<label>{label}</label>
			<select
				value={value}
				onChange={onChange}
				className='custom-select'
			>
				{options.map((option, index) => (
					<option
						key={option}
						value={index}
					>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}

export {Dropdown}

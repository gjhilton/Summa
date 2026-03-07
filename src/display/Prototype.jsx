import { styled } from '../styled-system/jsx';

export const Item = ({ 
	bg,
	children
}) => 
<styled.div
	bg={{
        base: bg,
        lg: "green.400"
      }}
    >
      {children}
	</styled.div>

export const ScreenMain = () =>
	<main>
		<HeaderEdit />
		<ListOfItems/>
	</main>
	
export const HeaderEdit = () =>
	<header>
	edit buttons here
	</header>	
	
export const ListOfItems = () =>
	<section>
		<ItemUnit />
	</section>
	
export const ItemUnit = () =>
	<Item>
	unit
	</Item>	
	
export const ItemExtended = () =>
	<Item>
	extended
	</Item>

export const ItemSubTotal = () =>
	<Item>
	sub
	</Item>
	
export const ItemTotal = () =>
	<Item>
	total
	</Item>
	
export const Block = ({children}) =>
	<div>
	{children}
	</div>

export const BlockTitle = ({children}) =>
	<Block>
	title
	{children}
	</Block>
	
export const BlockCurrency = ({children}) =>
	<Block>
	currency
	</Block>
	

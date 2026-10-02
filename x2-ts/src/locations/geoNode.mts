import {BoundingBox} from './box.mts'
import {Location} from '../models/location.mts'

/**
 * A node in a spatial index for locations.
 **/
class LocationIndexNode {
	MAX_CHILDREN = 10

	constructor(
		// Locations are only stored at the leaves of the tree
		public isLeaf: boolean,

		public parent: LocationIndexNode | null,
		public locations: Location[],

		// Bounding box containing all locations in node and its children
		public boundingBox: BoundingBox,

		// Internal nodes store references to their children
		public children: LocationIndexNode[],
	) {}

	toString() {
		if (this.isLeaf) {
			return `Node[${this.locations.length} locations, ${this.boundingBox}]`
		} else {
			return `Node[${this.children.length} children, ${this.boundingBox}]`
		}
	}

	/**
	 * Create a new leaf node that holds a list of locations.
	 */
	createChild(): LocationIndexNode {
		const boundingBox = new BoundingBox(
			Infinity,
			Infinity,
			-Infinity,
			-Infinity,
		)
		return new LocationIndexNode(true, this, [], boundingBox, [])
	}

	/**
	 * Create a new root node.
	 */
	static createRoot(): LocationIndexNode {
		const boundingBox = new BoundingBox(
			Infinity,
			Infinity,
			-Infinity,
			-Infinity,
		)
		return new LocationIndexNode(true, null, [], boundingBox, [])
	}

	/**
	 * Return the bounding box of the specified child.
	 */
	boundingBoxOfChild(childIndex: number): BoundingBox {
		// For a leaf, the bounding box of the child is just a box containing a
		// single location.
		if (this.isLeaf) {
			const location = this.locations[childIndex]
			if (location == null) throw new Error('Child index is out of range')
			return new BoundingBox(location.x, location.y, location.x, location.y)
		}

		// For an internal node, use the child's bounding box.
		const child = this.children[childIndex]
		if (child == null) throw new Error('Child index is out of range')
		return child.boundingBox
	}

	/**
	 * Return the child at the specified index.
	 */
	getChild(childIndex: number): LocationIndexNode | Location {
		if (this.isLeaf) {
			const location = this.locations[childIndex]
			if (location == null) throw new Error('Child index is out of range')
			return location
		}

		const child = this.children[childIndex]
		if (child == null) throw new Error('Child index is out of range')
		return child
	}

	/**
	 * Add a child to the node.
	 * Since leaf nodes have no child nodes, the "children" of a leaf node are just
	 * location objects. The children of internal nodes are other nodes.
	 */
	addChild(child: LocationIndexNode | Location) {
		if (this.isLeaf && child instanceof Location) {
			this.locations.push(child)
			this.boundingBox = this.boundingBox.extendedWithPoint(child.x, child.y)
		} else if (!this.isLeaf && child instanceof LocationIndexNode) {
			this.children.push(child)
			this.boundingBox = this.boundingBox.extendedWithBox(child.boundingBox)
		} else {
			throw new Error('Invalid child type')
		}
	}

	/**
	 * Inserts a location into a tree rooted at the current node,
	 * returning the new root(s) if changed.
	 *
	 * We might return multiple nodes if the initial node is split.
	 */
	insertLocation(location: Location): LocationIndexNode[] {
		// If this is a leaf node, add the location to the leaf's list of locations.
		if (this.isLeaf) {
			this.addChild(location)

			// Split the node if it has too many children
			if (this.locations.length > this.MAX_CHILDREN) {
				return this.split()
			}
			return [this]
		}

		let chosenChildIndex: number | undefined

		// This is an internal node. Check for a child that already contains location.
		for (const [strIndex, child] of Object.entries(this.children)) {
			const currentIndex = parseInt(strIndex)

			if (child.boundingBox.containsPoint(location.x, location.y)) {
				chosenChildIndex = currentIndex
			}
		}

		// No children contain the location, so we find the child that requires
		// the least enlargement of its bounding box.
		if (chosenChildIndex == null) {
			let bestEnlargement = Infinity
			for (const [strIndex, child] of Object.entries(this.children)) {
				const currentIndex = parseInt(strIndex)
				const enlargement =
					child.boundingBox.extendedWithPoint(location.x, location.y).area() -
					child.boundingBox.area()
				if (enlargement < bestEnlargement) {
					chosenChildIndex = currentIndex
					bestEnlargement = enlargement
				}
			}
		}

		if (chosenChildIndex == null) {
			throw new Error('Internal node with no children')
		}

		// Insert location into the chosen child.
		this.boundingBox = this.boundingBox.extendedWithPoint(
			location.x,
			location.y,
		)
		const chosenChild = this.children[chosenChildIndex]!
		const children = chosenChild.insertLocation(location)

		// If the child was split, update the child references.
		if (children.length === 2) {
			this.children[chosenChildIndex] = children[0]!
			this.children.push(children[1]!)

			// Split the node if it has too many children
			if (this.children.length > this.MAX_CHILDREN) {
				return this.split()
			}
		}

		return [this]
	}

	/**
	 * Split a node into two nodes.
	 */
	split(): LocationIndexNode[] {
		// Find two children to start the split.
		// We choose the two children that would require the most enlargement
		// to keep together.
		let splitIndices: [number, number] | undefined
		let worstEnlargement = -Infinity

		const numChildren = this.isLeaf
			? this.locations.length
			: this.children.length
		for (let i = 0; i < numChildren; i++) {
			for (let j = i + 1; j < numChildren; j++) {
				const iBox = this.boundingBoxOfChild(i)
				const jBox = this.boundingBoxOfChild(j)
				const combinedBox = iBox.extendedWithBox(jBox)
				const enlargement = combinedBox.area() - iBox.area() - jBox.area()
				if (enlargement > worstEnlargement) {
					splitIndices = [i, j]
					worstEnlargement = enlargement
				}
			}
		}

		if (splitIndices == null) {
			throw new Error('No children to split')
		}

		// We need to assign the remaining children to one of the two new nodes.
		const remainingIndices = []
		for (let i = 0; i < numChildren; i++) {
			if (i === splitIndices[0] || i === splitIndices[1]) continue
			remainingIndices.push(i)
		}

		const split1 = this.parent
			? this.parent.createChild()
			: LocationIndexNode.createRoot()
		split1.isLeaf = this.isLeaf
		split1.addChild(this.getChild(splitIndices[0]))

		const split2 = this.parent
			? this.parent.createChild()
			: LocationIndexNode.createRoot()
		split2.isLeaf = this.isLeaf
		split2.addChild(this.getChild(splitIndices[1]))

		while (remainingIndices.length > 0) {
			// Choose the child that has the greatest preference for one child or the
			// other based on enlargement required.
			let chosenChildIndex: number | undefined
			let chosenPreference: LocationIndexNode | undefined
			let greatestEnlargement = -Infinity

			for (const i of remainingIndices) {
				const iBox = this.boundingBoxOfChild(i)
				const enlargement1 =
					split1.boundingBox.extendedWithBox(iBox).area() -
					split1.boundingBox.area()
				const enlargement2 =
					split2.boundingBox.extendedWithBox(iBox).area() -
					split2.boundingBox.area()

				const enlargement = Math.abs(enlargement1 - enlargement2)
				if (enlargement > greatestEnlargement) {
					chosenChildIndex = i
					chosenPreference = enlargement1 < enlargement2 ? split1 : split2
					greatestEnlargement = enlargement
				}
			}

			if (chosenChildIndex == null || chosenPreference == null) {
				throw new Error('No child chosen')
			}

			chosenPreference.addChild(this.getChild(chosenChildIndex))

			// Careful: we must find the index of the chosen index to remove.
			const indexToRemove = remainingIndices.indexOf(chosenChildIndex)
			remainingIndices.splice(indexToRemove, 1)
		}

		return [split1, split2]
	}
}

export {LocationIndexNode}

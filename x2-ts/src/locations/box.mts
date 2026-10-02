/**
 * Representation of a 2-dimensional bounding box in coordinate space.
 */
class BoundingBox {
	minX: number
	minY: number
	maxX: number
	maxY: number

	/**
	 * Create a new bounding box with the given coordinates.
	 */
	constructor(minX: number, minY: number, maxX: number, maxY: number) {
		this.minX = minX
		this.minY = minY
		this.maxX = maxX
		this.maxY = maxY
	}

	toString( ) {
		// Helper to round a number to two decimal places.
		const round = (n: number) => {
			return Math.round(n * 100) / 100
		}

		return `${round(this.minX)}, ${round(this.minY)} - ${round(this.maxX)}, ${round(this.maxY)}`
	}

	/**
	 * Return the area of this bounding box.
	 */
	area( ): number {
		return (this.maxX - this.minX) * (this.maxY - this.minY)
	}

	/**
	 * Return whether this bounding box contains the given point.
	 */
	containsPoint(x: number, y: number): boolean {
		return this.minX <= x && x <= this.maxX && this.minY <= y && y <= this.maxY
	}

	/**
	 * Return whether this bounding box intersects with another.
	 */
	intersectsBox(other: BoundingBox): boolean {
		return (
			this.minX <= other.maxX &&
			this.maxX >= other.minX &&
			this.minY <= other.maxY &&
			this.maxY >= other.minY
		)
	}

	/**
	 * Return a new bounding box that includes the given point.
	 */
	extendedWithPoint(x: number, y: number): BoundingBox {
		return new BoundingBox(
			Math.min(this.minX, x),
			Math.min(this.minY, y),
			Math.max(this.maxX, x),
			Math.max(this.maxY, y),
		)
	}

	/**
	 * Return a new bounding box that includes the given box.
	 */
	extendedWithBox(other: BoundingBox): BoundingBox {
		return new BoundingBox(
			Math.min(this.minX, other.minX),
			Math.min(this.minY, other.minY),
			Math.max(this.maxX, other.maxX),
			Math.max(this.maxY, other.maxY),
		)
	}

	/**
	 * Return the distance between a bounding box and a point.
	 */
	distanceToPoint(x: number, y: number): number {
		// If the point is in the box, the distance is zero distance
		if (this.containsPoint(x, y)) {
			return 0
		}

		// If the point lies within the x range of box, the distance is the
		// y distance to the nearest edge
		if (this.minX <= x && x <= this.maxX) {
			return Math.min(Math.abs(this.minY - y), Math.abs(this.maxY - y))
		}

		// If the point lies within the y range of box, the distance is the
		// x distance to the nearest edge
		if (this.minY <= y && y <= this.maxY) {
			return Math.min(Math.abs(this.minX - x), Math.abs(this.maxX - x))
		}

		// Otherwise, the distance is the distance to the nearest corner
		return Math.min(
			((this.minX - x) ** 2 + (this.minY - y) ** 2) ** 0.5,
			((this.minX - x) ** 2 + (this.maxY - y) ** 2) ** 0.5,
			((this.maxX - x) ** 2 + (this.minY - y) ** 2) ** 0.5,
			((this.maxX - x) ** 2 + (this.maxY - y) ** 2) ** 0.5,
		)
	}
}

export {BoundingBox}

export type ColorModel = "red" | "blue" | "green" | "#f3f4f6"

export interface TaskModel {
	id: number
	title: string
	color: string
	completed: boolean
	createdAt: string
	updatedAt: string
}
import { useEffect } from "react";
import styles from "./TaskInput.module.scss";

type TaskInputProps = {
	addTask: (description: string) => void, 
	mode: boolean
	firstLoad: boolean
}

const TaskInput = ({addTask, mode, firstLoad}: TaskInputProps) => {

	let addTaskTimeout: ReturnType<typeof setTimeout>;
	let removeAnimationClass: ReturnType<typeof setTimeout>;

	function animateNewTask (): void {
		const inputField = document.getElementById("newTask") as HTMLInputElement;
		const inputFieldCopy = document.getElementById("newTaskCopy") as HTMLInputElement;
		inputFieldCopy.value = inputField.value;

		const taskContainerCopy = document.getElementById("taskContainerCopy") as HTMLInputElement;
		taskContainerCopy.classList.add(styles.mainContainerCopyAnimation);

		removeAnimationClass = setTimeout(() => {
			taskContainerCopy.classList.remove(styles.mainContainerCopyAnimation);
		}, 701);

	}
	
	function handleAddTask (): void {
		const inputField = document.getElementById("newTask") as HTMLInputElement;
		const newTask = inputField.value;

		const errorMessage = document.getElementById("errorMessage") as HTMLParagraphElement;

		if (newTask) {
			errorMessage.classList.remove(styles.showError);
			animateNewTask();
			inputField.value= "";
			addTaskTimeout = setTimeout(addTask, 703, newTask);	// Runs after the timeout which removes the mainContainerCopyAnimation class, so as not to remove it with useEffect's cleanup function
		} else {
			errorMessage.classList.add(styles.showError);
		}
	}

	// RETURNS CLASSES FOR DARK / LIGHT THEMES AND ANIMATIONS DEPENDING ON THIS LOAD BEING THE FIRST OR NOT
	function assignClasses (mainClass: string) {
		const mainClassLight = mainClass + "Light";
		const mainClassDark = mainClass + "Dark";
		const mainClassAnimatedLight= mainClass + "AnimatedLight";
		const mainClassAnimatedDark= mainClass + "AnimatedDark";

		switch (true) {
		case mode && firstLoad:
			return `${styles[mainClass]} ${styles[mainClassLight]}`;
			break;
		
		case mode && !firstLoad:
			return `${styles[mainClass]} ${styles[mainClassLight]} ${styles[mainClassAnimatedLight]}`;
			break;
		
		case !mode && firstLoad:
			return `${styles[mainClass]} ${styles[mainClassDark]}`;
			break;
			
		case !mode && !firstLoad:
			return `${styles[mainClass]} ${styles[mainClassDark]} ${styles[mainClassAnimatedDark]}`;
			break;
				
		default:
			break;
		}
	}

	useEffect( () => {
		return () => {
			clearTimeout(addTaskTimeout);
			clearTimeout(removeAnimationClass);
		};
	}, []);

	return (
		<>
			<div className={assignClasses("mainContainer")}>
				<input type="text" name="newTask" id="newTask" placeholder="Create a new todo..."></input>
				<button type="button" id="addTask" onClick={handleAddTask}>
					<img alt="Add new task" src="icon/icon-add.svg"></img>
				</button>
				<p id="errorMessage">Write a description!</p>
			
				<div id="taskContainerCopy" className={mode ? `${styles.mainContainerCopy} ${styles.mainContainerLightCopy}` : `${styles.mainContainerCopy} ${styles.mainContainerDarkCopy}`}>
					<input type="text" name="newTaskCopy" id="newTaskCopy"></input>
				</div>
			</div>
		</>
	);
};

export default TaskInput;

import { useEffect, useRef, useState } from "react";
import styles from "./App.module.scss";
import { Task } from "./classes/Task";
import TaskInput from "./components/TaskInput";
import TaskFilter from "./components/TaskFilter";

function App() {
	const TasksSavedInStorage = localStorage.getItem("userTasks");
	const [tasks, setTasks] = useState(TasksSavedInStorage ? (JSON.parse(TasksSavedInStorage) as Task[]) : []);
	const [mode, setMode] = useState(true);
	const [filter, setFilter] = useState("all");
	const [firstLoad, setfirstLoad] = useState(true);
	// const firstLoad = useRef(true);
	const incompleteItemCounter = countIncompleteTasks();
	const uniqueKeyInStorage = localStorage.getItem("uniqueKey");
	const uniqueKey = useRef(uniqueKeyInStorage ? (JSON.parse(uniqueKeyInStorage) as number) : 0);
	
	// RETURNS THE NUMBER OF INCOMPLETE TASKS
	function countIncompleteTasks () {
		let incompleteTasks = 0;

		tasks.map( (element) => {
			if(element.completed === false) {
				incompleteTasks++;
			}
		});

		return incompleteTasks;
	}

	// UNIQUE KEY GENERATOR FOR RENDER LOOPS
	function* generateKey () {
		while(true) {
			uniqueKey.current++;
			yield String(uniqueKey.current);
		}
	}

	// ADD TASKS FROM TASKINPUT COMPONENT
	function addTask (description: string): void {
		const tasksCopy = [...tasks];
		
		const keyGenerator = generateKey();
		const key = keyGenerator.next().value as string;

		const newTask = new Task(description, false, key);

		tasksCopy.unshift(newTask);
		setTasks(tasksCopy);
	}

	//CHANGES TASK "COMPLETED" PROPERTY
	function changeTaskStatus (e:React.MouseEvent<HTMLDivElement>) {
		const taskToChangeId = (e.target as HTMLDivElement).id;

		const tasksStringify = JSON.stringify(tasks);
		const tasksCopy: Task[] = JSON.parse(tasksStringify);
		
		tasksCopy.map( element => {
			if (element.id === taskToChangeId) {
				element.completed = !element.completed;
			}
		});

		setTasks(tasksCopy);
	}

	// DELETE A TASK
	function deleteTask (e:React.MouseEvent<HTMLImageElement>) {
		const taskToDelete = (e.target as HTMLImageElement).id;
		
		const tasksCopy: Task[] = [];

		tasks.map( element => {
			if(element.id !== taskToDelete) {
				tasksCopy.push(element);
			}
		});

		setTasks(tasksCopy);
	}

	//DELETE ALL COMPLETE TASKS
	function deleteAllCompletedTasks () {
		const tasksCopy: Task[] = [];

		tasks.map( element => {
			if(element.completed !== true) {
				tasksCopy.push(element);
			}
		});

		setTasks(tasksCopy);
	}

	// RENDERS ACTUAL TASKS LIST
	function renderTasks () {
		if(filter === "all") {
			return tasks.map( element => (
				<div key={element.id} draggable="true" className={styles.taskItem}>
					<div onClick={changeTaskStatus}  id={element.id} className={element.completed ? `${styles.taskIconCompleted}` : `${styles.taskIconIncomplete}`}></div>
					<p className={element.completed ? `${styles.taskTextCompleted}` : `${styles.taskTextIncomplete}`}>{element.description}</p>
					<img alt="Icon Delete" src="icon/icon-cross.svg" id={element.id} onClick={deleteTask}/> 
				</div>
			));
		} else if (filter === "active") {
			return tasks.map( element => {
				if (element.completed === false) {
					return (
						<div key={element.id} draggable="true" className={styles.taskItem}>
							<div onClick={changeTaskStatus}  id={element.id} className={element.completed ? `${styles.taskIconCompleted}` : `${styles.taskIconIncomplete}`}></div>
							<p className={element.completed ? `${styles.taskTextCompleted}` : `${styles.taskTextIncomplete}`}>{element.description}</p>
							<img alt="Icon Delete" src="icon/icon-cross.svg" id={element.id} onClick={deleteTask}/> 
						</div>
					);
				}
			});
		} else {
			return tasks.map( element => {
				if (element.completed === true) {
					return (
						<div key={element.id} draggable="true" className={styles.taskItem}>
							<div onClick={changeTaskStatus}  id={element.id} className={element.completed ? `${styles.taskIconCompleted}` : `${styles.taskIconIncomplete}`}></div>
							<p className={element.completed ? `${styles.taskTextCompleted}` : `${styles.taskTextIncomplete}`}>{element.description}</p>
							<img alt="Icon Delete" src="icon/icon-cross.svg" id={element.id} onClick={deleteTask}/> 
						</div>
					);
				}
			});
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
		// SAVE TASKS AND UNIQUEKEY TO LOCAL STORAGE
		localStorage.setItem("userTasks", JSON.stringify(tasks));
		localStorage.setItem("uniqueKey", JSON.stringify(uniqueKey.current));

		// CHANGE firstLoad FLAG TO ASSIGN CORRECT LIGHT / DARK THEMES ANIMATIONS
		setfirstLoad(false);

		// EVENT LISTENERS, FUNCTIONS AND CLASSES FOR DRAGGABLE ITEMS
		const draggableItems = document.querySelectorAll("div[draggable]");
		let draggedItemId: string;
		
		function handleDragstart (this: HTMLElement) {
			this.classList.add(styles.dragging);
			draggedItemId = document.querySelector(`.${styles.dragging} div`)!.id;
		}

		function handleDragend (this: HTMLElement) {
			this.classList.remove(styles.dragging);
		}

		function handleDragover (this: HTMLElement, event: Event) {
			event.preventDefault();
			const draggableItemsArray = Array.from(draggableItems);

			draggableItemsArray.map( (element)=> {
				element.classList.remove(styles.dragover);
			});

			if(this.firstElementChild!.id !== draggedItemId ) {
				this.classList.add(styles.dragover);
			}
		}

		function handleDrop (this: HTMLElement, event: Event) {
			event.preventDefault();
			this.classList.remove(styles.dragover);

			// draggedItem REPRESENTS THE DRAGGED ITEM.
			// THIS REPRESENTS THE TARGET
			const targetId = this.firstElementChild!.id;
			const draggedItemIndex = tasks.findIndex( (element) => element.id === draggedItemId);
			const targetIndex = tasks.findIndex( (element) => element.id === targetId);

			const tasksCopy: Task[] = [];

			tasks.map ( (element) => {
				switch (true) {
				case element.id !== draggedItemId && element.id !== targetId:
					tasksCopy.push(element);						
					break;

				case element.id !== draggedItemId && element.id === targetId && draggedItemIndex > targetIndex :
					tasksCopy.push(tasks[draggedItemIndex]);	
					tasksCopy.push(element);				
					break;

				case element.id !== draggedItemId && element.id === targetId && draggedItemIndex < targetIndex :
					tasksCopy.push(element);
					tasksCopy.push(tasks[draggedItemIndex]);	
					break;
			
				case element.id === draggedItemId && element.id === targetId:
					tasksCopy.push(element);						
					break;
				
				default:
					break;
				}
			});

			setTasks(tasksCopy);
		}

		draggableItems.forEach( (element: Element) => {
			element.addEventListener("dragstart", handleDragstart);
			element.addEventListener("dragend", handleDragend);
			element.addEventListener("dragover", handleDragover);
			element.addEventListener("drop", handleDrop);
		});

		return () => {
			draggableItems.forEach( (element: Element) => {
				element.removeEventListener("dragstart", handleDragstart);
				element.removeEventListener("dragend", handleDragend);
				element.removeEventListener("dragover", handleDragover);
				element.removeEventListener("drop", handleDrop);
			});
		};
	}, [tasks, filter]);

	return (
		<div className={assignClasses("mainContainer")}>

			<header className={styles.header}>
				<h1>TODO</h1>
				<img alt="Theme icon" src={mode ? "icon/icon-moon.svg" : "icon/icon-sun.svg"} onClick={() => setMode(!mode) }	/>
			</header>

			<main className={styles.sectionMainContainer}>

				<div className={styles.tasksInputMainContainer}>
					<TaskInput addTask={addTask} mode={mode} firstLoad={firstLoad} />
				</div>

				<div className={assignClasses("tasksListContainer")}>
					{renderTasks()}
					<div className={styles.taskCounterContainer}>
						<p>{incompleteItemCounter} items left</p>
						<div className={styles.taskFilterContainerDesktop}>
							<TaskFilter mode={mode} filter={filter} setFilter={setFilter} firstLoad={firstLoad}/>
						</div>
						<button type="button" onClick={deleteAllCompletedTasks} className={styles.deleteAllButton}>Clear Completed</button> 
					</div>
				</div>

				<div className={styles.taskFilterContainerMobile}>
					<TaskFilter mode={mode} filter={filter} setFilter={setFilter} firstLoad={firstLoad}/>
				</div>

				<p className={assignClasses("reorderMessage")}>Drag and drop to reorder list</p>
				
			</main>

		</div>
	);
}

export default App;

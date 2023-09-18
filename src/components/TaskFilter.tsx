import styles from "./TaskFilter.module.scss";

type TaskFilterProps = {
	mode: boolean,
	filter: string,
	setFilter: React.Dispatch<React.SetStateAction<string>>
	firstLoad: boolean
}

const TaskFilter = ({mode, filter, setFilter, firstLoad} : TaskFilterProps) => {
	
	function changeFilter(e:React.MouseEvent<HTMLButtonElement>) {
		setFilter((e.target as HTMLButtonElement).name);
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
	
	return (
		<div className={assignClasses("mainContainer")}>
			<button type="button" name="all" onClick={changeFilter} className={filter === "all" ? `${styles.filterButton} ${styles.filterActive}` : styles.filterButton}>All</button>
			<button type="button" name="active" onClick={changeFilter} className={filter === "active" ? `${styles.filterButton} ${styles.filterActive}` : styles.filterButton}>Active</button>
			<button type="button" name="completed" onClick={changeFilter} className={filter === "completed" ? `${styles.filterButton} ${styles.filterActive}` : styles.filterButton}>Completed</button>
		</div>
	);
};

export default TaskFilter;

import styles from "./TaskFilter.module.scss";

type TaskFilterProps = {
	mode: boolean,
	filter: string,
	setFilter: React.Dispatch<React.SetStateAction<string>>
}

const TaskFilter = ({mode, filter, setFilter} : TaskFilterProps) => {
	
	function changeFilter(e:React.MouseEvent<HTMLButtonElement>) {
		setFilter((e.target as HTMLButtonElement).name);
	}
	
	return (
		<div className={mode ? `${styles.mainContainer} ${styles.mainContainerLight}` : `${styles.mainContainer} ${styles.mainContainerDark}`}>
			<button type="button" name="all" onClick={changeFilter} className={filter === "all" ? `${styles.filterButton} ${styles.filterActive}` : styles.filterButton}>All</button>
			<button type="button" name="active" onClick={changeFilter} className={filter === "active" ? `${styles.filterButton} ${styles.filterActive}` : styles.filterButton}>Active</button>
			<button type="button" name="completed" onClick={changeFilter} className={filter === "completed" ? `${styles.filterButton} ${styles.filterActive}` : styles.filterButton}>Completed</button>
		</div>
	);
};

export default TaskFilter;

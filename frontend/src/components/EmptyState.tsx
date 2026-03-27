import styles from './dashboard.module.css';

export default function EmptyState({ message }: { message: string }) {
  return (
    <section className={`${styles.panel} ${styles.emptyState}`}>
      <h2>暂无可展示内容</h2>
      <p>{message}</p>
    </section>
  );
}

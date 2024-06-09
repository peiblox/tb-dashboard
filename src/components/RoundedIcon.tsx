import { ReactNode } from "react";
import styles from '@/styles/components/RoundedIcon.module.css';

export default function RoundedIcon({ icon = "" as ReactNode }) {
  return (
    <span className={styles['rounded-icon']}>
      {icon}
    </span>
  )
}

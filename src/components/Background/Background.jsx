import styles from './Background.module.css'

const circles = [
  { color: "rgba(255, 134, 128, 0.7)", top: "-55%", left: "70%" },
  { color: "rgba(12, 186, 137, 0.7)", top: "15%", left: "-15%" },
  { color: "rgba(142, 90, 255, 0.7)", top: "60%", left: "80%" },
//   { color: "rgba(213, 195, 56, 0.7)", top: "120%", left: "-15%" },
//   { color: "rgba(12, 186, 137, 0.7))", top: "160%", left: "5%" },
];

function Background() {
    return (
        <div className={styles.bokehContainer}>
            {circles.map((circle, idx) => (
                <div
                key={idx}
                className={styles.bokehCircle}
                style={{
                    backgroundColor: circle.color,
                    top: circle.top,
                    left: circle.left,
                }}
                />
        ))}
        </div>
    )
}

export default Background;


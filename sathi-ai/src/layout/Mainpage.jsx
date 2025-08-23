import "./layout.css";

/**
 * MainPage layout
 * Props:
 * - title: string
 * - subtitle?: string
 * - main: ReactNode            (required)  - the big center component
 * - rightRail?: ReactNode      (optional)  - stack on the right
 * - notes?: ReactNode          (optional)  - panel above chat
 * - chat?: ReactNode           (optional)  - chat dock at bottom
 * - headerRight?: ReactNode    (optional)  - top-right (e.g., logo, actions)
 */
export default function MainPage({
  title,
  subtitle,
  main,
  rightRail,
  notes,
  chat,
  headerRight,
}) {
  return (
    <section className="mp">
      <header className="mp__header">
        <div>
          <h1 className="mp__title">{title}</h1>
          {subtitle && <p className="mp__subtitle">{subtitle}</p>}
        </div>
        <div className="mp__headerRight">{headerRight}</div>
      </header>

      <div className="mp__grid">
        <div className="mp__main">{main}</div>
        {/* {rightRail && <aside className="mp__rail">{rightRail}</aside>} */}
      </div>

      {notes && <div className="mp__notes">{notes}</div>}
      {chat && <div className="mp__chat">{chat}</div>}
    </section>
  );
}

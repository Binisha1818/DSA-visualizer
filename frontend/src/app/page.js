import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="app-layout">
        <Sidebar />

        <main className="main-content">
          <section className="hero">
            <p className="eyebrow">INTERACTIVE LEARNING</p>

            <h1>
              Understand DSA.
              <br />
              <span> Don't just memorize it.</span>
            </h1>

            <p className="hero-description">
              Visualize algorithms, understand every step, and build a
              stronger intuition for data structures and algorithms.
            </p>

      
          </section>
        </main>
      </div>
    </>
  );
}
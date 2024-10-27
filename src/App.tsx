import "./index.css";
import { Index } from "./routes";
import { Layout } from "./routes/Layout";

// to-do: split in auth stack and app stack
export function App() {
    return (
        <Layout>
            <Index />
        </Layout>
    );
}
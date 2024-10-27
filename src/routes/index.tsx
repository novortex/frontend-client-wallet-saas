import { Route, Routes } from "react-router-dom";
import { Wallet } from "@/pages/wallet";
import { Graphs } from "@/pages/graphs";
import { History } from "@/pages/history";
import { Clients } from "@/pages/wallets";
import { Infos } from "@/pages/infos";
import { Customers } from "@/pages/customers";
import { AssetsOrg } from "@/pages/assets-org";
import { Login } from "@/pages/login";
import { ErrorPage } from "@/pages/404";

export function Index() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/wallet/:walletUuid/assets" element={<Wallet />} />
            <Route path="/wallets" element={<Clients />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/admin/orgs" element={<AssetsOrg />} />
            <Route path="/clients/:walletUuid/infos" element={<Infos />} />
            <Route path="/wallet/:walletUuid/graphs" element={<Graphs />} />
            <Route path="/wallet/:walletUuid/history" element={<History />} />
            <Route path="*" element={<ErrorPage />} />
        </Routes>
    );
}

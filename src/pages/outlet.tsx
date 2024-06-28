import { Outlet } from 'react-router-dom'

// TODO: colocar a verificação da pagina para não aparecer a navegação no login
export default function Root() {
  return (
    <>
      {/* all the other elements */}
      <div id="detail">
        <Outlet />
      </div>
    </>
  )
}

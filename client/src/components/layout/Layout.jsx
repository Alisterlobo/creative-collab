import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const childrenWithProps = typeof children.type === 'function'
    ? { ...children, props: { ...children.props, activeFilter, setActiveFilter } }
    : children;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="flex max-w-screen-xl mx-auto">
        <Sidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <main className="flex-1 min-h-[calc(100vh-60px)] border-x border-black/10">
          {childrenWithProps}
        </main>
      </div>
    </div>
  );
}



// import Navbar from './Navbar';
// import Sidebar from './Sidebar';

// export default function Layout({ children }) {
//   return (
//     <div className="min-h-screen bg-cream">
//       <Navbar />
//       <div className="flex max-w-screen-xl mx-auto">
//         <Sidebar />
//         <main className="flex-1 min-h-[calc(100vh-60px)] border-x border-black/10">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
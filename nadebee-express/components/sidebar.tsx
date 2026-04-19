// "use client";
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';

// export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
//   const pathname = usePathname();

//   const menu = [
//     { name: "Home", href: "/pelanggan/home" },
//     { name: "Tracking", href: "/pelanggan/tracking" },
//     { name: "Request Pickup", href: "/pelanggan/request-pickup" },
//     { name: "Riwayat", href: "/pelanggan/riwayat" },
//     { name: "Profile", href: "/pelanggan/profil" },
//   ];

//   return (
//     <>
//       {/* Overlay Gelap */}
//       <div 
//         className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
//           isOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`} 
//         onClick={onClose} 
//       />

//       {/* Panel Sidebar */}
//       <aside className={`fixed inset-y-0 left-0 z-[70] w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
//         isOpen ? 'translate-x-0' : '-translate-x-full'
//       }`}>
//         <div className="p-6 flex justify-between items-center border-b">
//           <span className="font-bold text-gray-800">Nadebee Express</span>
//           <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-2xl">×</button>
//         </div>
//         <nav className="p-4 space-y-2">
//           {menu.map((item) => (
//             <Link 
//               key={item.href} 
//               href={item.href} 
//               onClick={onClose}
//               className={`block p-4 rounded-2xl font-bold text-sm transition-all ${
//                 pathname === item.href ? 'bg-[#58B65C] text-white' : 'text-gray-500 hover:bg-green-50'
//               }`}
//             >
//               {item.name}
//             </Link>
//           ))}
//         </nav>
//       </aside>
//     </>
//   );
// }
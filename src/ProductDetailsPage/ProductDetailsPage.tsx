import NavBar from './components/NavBar'
import Header from './components/Header'
import SubHeader from './components/SubHeader'
import LeftSidebar from './components/LeftSidebar'
import MainContent from './components/MainContent'
import RightSidebar from './components/RightSidebar'

export default function ProductDetailsPage() {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white">
      {/* Left Navigation Bar */}
      <NavBar />
      
      {/* Main Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <Header />
        
        {/* Sub Header with Tabs */}
        <SubHeader />
        
        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Entity Tree */}
          <LeftSidebar />
          
          {/* Main Content */}
          <MainContent />
          
          {/* Right Sidebar - AI Insights */}
          <RightSidebar />
        </div>
      </div>
    </div>
  )
}

import WeeklyBrief from '../WeeklyBrief'
import UsageOutcomes from '../UsageOutcomes'
import ObjectiveAlignment from '../ObjectiveAlignment'
import JiraEpicsAnalysis from '../JiraEpicsAnalysis'
import PeopleAllocations from '../PeopleAllocations'
import AllocationCharts from '../AllocationCharts'

export default function OverviewTab() {
  return (
    <div className="space-y-8">
      {/* Weekly Brief */}
      <WeeklyBrief />
      
      <hr className="border-t border-gray-200 my-8" />

      {/* Usage & Outcomes */}
      <UsageOutcomes />
      
      <hr className="border-t border-gray-200 my-8" />

      {/* Objective Alignment */}
      <ObjectiveAlignment />
      
      <hr className="border-t border-gray-200 my-8" />

      {/* JIRA Epics Analysis */}
      <JiraEpicsAnalysis />
      
      <hr className="border-t border-gray-200 my-8" />

      {/* People Allocations */}
      <PeopleAllocations />
      
      <hr className="border-t border-gray-200 my-8" />

      {/* Allocation Charts */}
      <AllocationCharts />
    </div>
  )
}


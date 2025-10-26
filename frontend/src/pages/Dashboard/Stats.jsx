import React from 'react'
import StatsCard from '../../components/StatsCard'

const Stats = () => {
    return (
        <div class="row">
            <StatsCard title="Compliant Sites" number="5" color="bg-1" />
            <StatsCard title="Non Compliant Sites" number="2" color="bg-2" />
            <StatsCard title="Corrective Actions" number="7" color="bg-3" />
            <StatsCard title="Corrective Actions" number="7" color="bg-4" />
        </div>
    )
}

export default Stats
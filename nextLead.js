/*
This is a simple example using the lead distribution factor to distribute leads to agents.
The loop at the bottom of the code is set to mimic a week or however number of hours you want to simulate.
At the top we have a set of test entries for agents with a simple distribution percentage and rota.
*/

const agentDist = {
    _agents: [
      {name: 'AgentX', dist: 100, leads: 1, start: new Date('2024-03-14 10:00:00'), end:  new Date('2024-03-14 16:00:00'), factor: 0},
      {name: 'AgentB', dist: 50, leads: 1, start:  new Date('2024-03-11 08:00:00'), end:  new Date('2024-03-11 16:00:00'), factor: 0},
      {name: 'AgentD', dist: 25, leads: 1, start:  new Date('2024-03-11 10:00:00'), end:  new Date('2024-03-11 21:00:00'), factor: 0},
      {name: 'AgentA', dist: 70, leads: 1, start:  new Date('2024-03-11 08:00:00'), end:  new Date('2024-03-11 16:00:00'), factor: 0},
      {name: 'AgentZ', dist: 100, leads: 1, start:  new Date('2024-03-11 12:00:00'), end:  new Date('2024-03-11 16:00:00'), factor: 0},
      {name: 'AgentC', dist: 25, leads: 1, start:  new Date('2024-03-11 09:00:00'), end:  new Date('2024-03-11 17:00:00'), factor: 0},
      {name: 'AgentY', dist: 100, leads: 1, start:  new Date('2024-03-11 11:00:00'), end:  new Date('2024-03-11 21:00:00'), factor: 0}
    ],
    get agents() {
      return this._agents;
    },
    addAgent(name, dist, leads, start, end, factor) {
      let agent = {
        name: name,
        dist: dist,
        leads: leads,
        start: start,
        end: end,
        factor: factor
      }
      this._agents.push(agent);
    }
}

let maxLeads = 200;

const findAgentByFactor = (agentArray) => {
    //remove agents from array once their shift ends
    let nowHour = new Date(currentHour.getTime() + oneHour);
    agentArray = agentArray.filter(agent => agent.end.getHours() > nowHour.getHours());

    //remove agents that have reached the max number of leads that can be assigned
    agentArray = agentArray.filter(agent => agent.leads < maxLeads);
    
    //if there are agents with no leads in the pool then sort by distribution factor.
    //once all agents have a lead then sort by factor
    if (agentArray.some(val => val.factor === 0)) {
        //sort agents in order of distribution
        agentArray.sort((a, b) => b.dist - a.dist);
    } else {
        //sort agents in order of factor
        agentArray.sort((a, b) => b.factor - a.factor);
    }
    //return the first agent in the list
    return agentArray[0];
}

//as leads are assigned to agents we need to update the factor for each agent
const setAgentFactors = (agentArray,totalDist,totalLeads) => {
    agentArray.forEach(agent => {
        agent.factor = ((totalDist / totalLeads) * (agent.dist) / agent.leads);
    });
}

//add up the distribution % for each agent to find total distribution percentage which is then used in factor calc
let totalDistPer = agentDist.agents.reduce(
    (partialNum, agent) => partialNum + agent.dist, 0
);

//function to check rota for each agent and reduce distribution based on hours online
//based on shift pattern of X hours reduce the distribution by X % to allow for shifts which are less than X hours
const checkRota = (agentArray) => {
    agentArray.forEach(agent => {
        adjustDist(agent);}
    )
}

const adjustDist = (agent) => {
    let hoursOnline = agent.end.getHours() - agent.start.getHours();
    let shiftHours = 8; //this is the amount of hours in a standard shift pattern
    //reduce distribution percentage based on hours online
    if (hoursOnline < shiftHours) {
        agent.dist = agent.dist * (hoursOnline / shiftHours);
        agent.setDist = agent.dist;
    }
}

//call function to check rota to adjust distribution based on shift pattern
checkRota(agentDist.agents);
let unassignedLeads = 0;

const assignLeads = (numberOfLeads) => {

    for (i = 1; i <= numberOfLeads; i++) {
        //get total leads currently assigned
        let totalAssignedLeads = agentDist.agents.reduce(
            (partialNum, agent) => partialNum + agent.leads, 0
        );
        //get the top agent and assign the lead
        anAgent = findAgentByFactor(agentDist.agents);
        //if not agent return then add to unassigned leads
        if (!anAgent) {
            unassignedLeads += numberOfLeads;
            setAgentFactors(agentDist.agents,totalDistPer,totalAssignedLeads)
            break;
        } else {
            anAgent.leads += 1;
        }
        //now update the factors for each agent
        //totalAssignedLeads //totalDistPer
        setAgentFactors(agentDist.agents,totalDistPer,totalAssignedLeads)
    }
}

const showCurrentLeadsAssigned = () => {

    console.log(`Leads received: ${totalLeads} Unassigned leads: ${unassignedLeads}`);

    agentDist.agents.sort((a, b) => b.dist - a.dist);
    agentDist.agents.forEach(agent => {
        console.log(agent.name + " " + agent.leads + " " + agent.factor + " " + agent.dist);
    });

}

//loop to mimic a weeks progress in days, hours and minutes
const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
const oneHour = 60 * 60 * 1000; // minutes * seconds * milliseconds

const now = new Date("2024-03-10 23:00:00");
let currentDay = new Date(now.getTime());
let currentHour = new Date(now.getTime());

let overnightLeads = 100; //This is to start the test simulation with 100 leads in the pool from previous day
let totalLeads = overnightLeads;

//168 is 7 days
for (let j = 0; j < 48; j++) { // 7 days

    let leads = j === 0 ? overnightLeads : Math.floor(Math.random() * 45) + 5;

    if (j % 24 === 0) {
        currentDay = new Date(currentDay.getTime() + oneDay);
        console.log(`Day ${currentDay.toLocaleDateString()}`);
        if (unassignedLeads > 0) {
            leads = unassignedLeads;
            unassignedLeads = 0;
            totalLeads = 0;
            agentDist.agents.forEach(agent => {agent.leads = 0; agent.factor = 0;});
        }
    }

    //simulates a new agent being enabled during the day
    if (j === 12) {
        agentDist.addAgent('AgentW', 100, 0, new Date('2024-03-14 10:00:00'), new Date('2024-03-14 16:00:00'), 0);
        totalDistPer += 100; 
        adjustDist(agentDist.agents[7]);
    }
    
    assignLeads(leads);
    currentHour = new Date(currentHour.getTime() + oneHour);
    console.log(`\tHour ${currentHour.toLocaleTimeString()} Leads: ${leads}`);

    showCurrentLeadsAssigned();
    totalLeads += leads;
}



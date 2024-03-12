## Lead Allocation

This is an example of distributing sales leads to agents using a distribution factor. The factor is based on the number of leads, number of agents and a distribution percentage assigned to each agent.

### Agent Info

For each agent a distribution percentage is required. This will determine the amount of sales leads the agent will receive within a 24 hour period based on their shift pattern.

Agent A 100%

Agent B 75%

Agent C 25%

Agent D 100%

In the example above Agent A and D will receive a larger proportion of leads then Agents B and C.

The reason for this is so a manager can control a fair distribution of leads. For example Agent C is in training and therefore should only receive a small portion of the leads until they become more proficient. Agents A and D are top sales agents and in this case we would want them to receive a higher proportion of leads.
Another reason could be a top agent is training others but they will be working leads at some point.

### Distribution Factor

Below is the calculation that will determine the distribution factor for each agent which is calculated every time a lead is assigned to an agent. This needs to be run for each agent after a lead is assigned. The resulting factor can then be ordered and the agent with the lowest rating will be the next agent to be assigned a lead.

**agent.factor = ((totalDistributionPercent / totalLeadsReceived) * (agent.distributionPercentage) / agent.leadAssigned);**

The totalDistributionPercent is a sum of all distribution percentages across all available agents. In example above this will be 300%. 

The totalLeadsReceived is a running total of leads received in a day. Initially this will include leads held over from the previous day.

The agent.leadAssigned value is the number of leads currently assigned to that agent.

The agent.distributionPercentage is the value shown above in the example i.e. 100% for Agent A.

### Rota

For each agent a rota needs to be maintained. The Rota should contain the shift start and end times. It should also allow for holiday and sickness. 
This will allow the system to determine which sales agents are available for the current day.

In the provided example code there is a function called checkRota. This determines for each agent the shift duration the agent is available for that day. The standard duration is set to 8 hours. This is just an example, suggest this is a top level admin setting. If the agents shift duration is less than the standard shift the distribution percentage factor is reduced based on the time they are available.

This accounts for agents that are in for a shorted duration. So in the code example (nextLeads.js) we have Agent Z who's shift duration is only 4 hours.

{name: 'AgentZ', dist: 100, leads: 1, start:  new Date('2024-03-11 12:00:00'), end:  new Date('2024-03-11 16:00:00'), factor: 0},

Their initial distribution percentage is set to 100% but because they are only in for half a day it would be mean if the full allocation of leads was assigned to them they would not likely have enough time to work through these. Therefore this function adjusts the distribution percentage to account for this. In this example by 50% because the agent is only in for 4 hours which is half a standard shift of 8 hours.

This function should be called before the lead allocation process once and anytime the Rota or other agent adjustments are made.

### Lead allocation process

Step by Step here is how leads are allocated using this process.

1. At the start of the day the lead allocation process should be run once for all leads held overnight to distribute these to the available agents. Thereafter the allocation process should be triggered by a sales lead being received from a lead source provider.
2. At the start the factors for each agent will be 0, therefore initially the order should be based on the distribution percentage until all agents have received 1 lead. This will then allow the factor to be calculated for all agents.
2. The distribution factor should be calculated every time a lead is assigned to an agent.
3. Leads will stop being assigned to an agent when the end of their shift is reached. 
4. The unassigned leads will be held until 00:00 the following day when the process will re-start an allocate those leads.

### Issues to look out for.

At the end of a day it's possible that only one or two agents are still available. If a large number of leads are received during this time those agents will receive all of these leads. If one of these agents has a much higher distribution percentage they will receive the majority of them.
In the code example we have just simply removed agents from the list if the max number of leads has been received. However this is a simple example and it will depend on the average volume of leads normally received in day. 
One option would be to start to reduce the distribution factor the nearer the current time gets to the end of the shift. However this would not stop the issue where an agent is last to leave on that day. You would need to take into account the number of available agents and look to restrict the leads based on the number of available agents. 

Distributing unassigned leads from the previous day is done from the exact beginning of the day. The process only checks which agents are available for that day. 
Based on requirements there may be a couple of options to make this a little smarter. You could set it so agents are only assigned leads one hour before their shift starts. This would be the simplest option however it would cause the same issue as above where the agents who start early will receive all the overnight unassigned leads. This however may be preferable and will depend on how the sales team operate. 
The other possibility is to add a weighting factor based on the start of an agents shift. However working this logic out to ensure there is a fair distribution is difficult. It could be as per the shift duration reduction in checkRota you gradually increase the distribution percentage the nearer the time gets to the agents start time. The downside is this may just provide the same results if you were to continue with the approach of assigning leads when the day starts. 




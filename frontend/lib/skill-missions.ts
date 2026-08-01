import type { TrailStop } from "@/lib/trail-map-data";

export type LearnerRole = "parent" | "teacher" | "volunteer" | "employer" | "friend";

export const learnerRoles: Record<LearnerRole, { label: string; context: string }> = {
  parent: { label: "Parent or carer", context: "a family activity" },
  teacher: { label: "Teacher", context: "a learning session" },
  volunteer: { label: "Volunteer", context: "a Love 21 programme" },
  employer: { label: "Employer", context: "a team activity" },
  friend: { label: "Friend", context: "a day out together" },
};

export type SkillMissionOption = {
  id: string;
  label: string;
  feedback: string;
  correct: boolean;
  sceneChange?: string;
};

export type SkillMission = {
  skill: string;
  title: string;
  scenario: string;
  instruction: string;
  successMessage: string;
  options: SkillMissionOption[];
};

type MissionTemplate = Omit<SkillMission, "scenario"> & {
  scenario: (roleContext: string) => string;
};

const missionTemplates: Record<string, MissionTemplate> = {
  "san-po-kong-sport": {
    skill: "Recognise strengths",
    title: "Build the starting team",
    scenario: (context) =>
      `During ${context}, Kai wants to join the ball game but prefers predictable turns and clear roles.`,
    instruction: "Choose the action that helps Kai contribute as a teammate.",
    successMessage: "The team now has clear roles, and Kai steps confidently onto the court.",
    options: [
      {
        id: "clear-role",
        label: "Ask which role Kai wants, then demonstrate the first turn",
        feedback: "Choice and a clear demonstration support participation without making assumptions.",
        correct: true,
        sceneChange: "Role cards appear and the whole team lines up together.",
      },
      {
        id: "sit-out",
        label: "Let Kai watch because the game may be too difficult",
        feedback: "Watching can be a choice, but deciding for Kai removes the chance to participate.",
        correct: false,
      },
      {
        id: "same-way",
        label: "Explain that everyone must play in exactly the same way",
        feedback: "Fair participation does not require identical support or identical roles.",
        correct: false,
      },
    ],
  },
  "victoria-park-pool": {
    skill: "Offer choice",
    title: "Find the right pace",
    scenario: (context) =>
      `At ${context}, Mei pauses at the pool edge while the rest of the group is ready to begin.`,
    instruction: "Help Mei join without rushing or taking over.",
    successMessage: "Mei chooses the shallow lane and enters when she is ready.",
    options: [
      {
        id: "offer-options",
        label: "Offer a shallow lane, a visual preview, or more time",
        feedback: "Concrete choices preserve autonomy and make the next step predictable.",
        correct: true,
        sceneChange: "The water calms and three clear entry paths light up.",
      },
      {
        id: "pull-in",
        label: "Take Mei by the hand and pull her in quickly",
        feedback: "Physical prompting without consent can increase uncertainty and remove control.",
        correct: false,
      },
      {
        id: "cheer-louder",
        label: "Ask everyone to cheer more loudly",
        feedback: "More noise can add pressure. Ask what support feels useful first.",
        correct: false,
      },
    ],
  },
  "san-po-kong-kitchen": {
    skill: "Make steps visible",
    title: "Make the recipe accessible",
    scenario: (context) =>
      `In ${context}, the recipe is being explained quickly while ingredients and tools cover the table.`,
    instruction: "Change the setup so everyone can cook more independently.",
    successMessage: "The visual recipe turns a busy table into a shared, achievable task.",
    options: [
      {
        id: "visual-steps",
        label: "Lay out picture steps and ingredients in the order they are used",
        feedback: "Visible sequences reduce memory load and support independent participation.",
        correct: true,
        sceneChange: "Recipe cards snap into order and each ingredient finds its place.",
      },
      {
        id: "repeat-fast",
        label: "Repeat every instruction more loudly",
        feedback: "Volume does not make a fast, multi-step instruction easier to process.",
        correct: false,
      },
      {
        id: "do-it",
        label: "Complete the difficult steps for everyone",
        feedback: "Doing the task for someone removes opportunities to practise and contribute.",
        correct: false,
      },
    ],
  },
  "family-lounge": {
    skill: "Listen before helping",
    title: "Respond to overload",
    scenario: (context) =>
      `During ${context}, the room becomes crowded and Sam covers their ears and moves toward the doorway.`,
    instruction: "Choose a response that changes the environment, not the person.",
    successMessage: "The room becomes calmer, and Sam chooses when to rejoin.",
    options: [
      {
        id: "calm-choice",
        label: "Lower the noise and offer a quiet space without demanding an answer",
        feedback: "Reducing sensory load and offering space supports regulation without punishment.",
        correct: true,
        sceneChange: "Lights soften, the crowd parts, and a calm corner opens.",
      },
      {
        id: "behave",
        label: "Ask Sam to stop and behave like everyone else",
        feedback: "Overload is not misbehaviour. The environment may need to change first.",
        correct: false,
      },
      {
        id: "questions",
        label: "Ask several questions until Sam explains what is wrong",
        feedback: "Processing questions can be harder during overload. Reduce demands and wait.",
        correct: false,
      },
    ],
  },
  "community-dinner": {
    skill: "Design for belonging",
    title: "Open up the celebration",
    scenario: (context) =>
      `You are preparing ${context}, with music, speeches, food stations, and many new faces.`,
    instruction: "Choose the change that gives guests more ways to participate.",
    successMessage: "Guests can join the celebration in the way that works for them.",
    options: [
      {
        id: "choice-map",
        label: "Add a visual schedule, quiet table, and clear activity choices",
        feedback: "Predictability and multiple participation options make belonging practical.",
        correct: true,
        sceneChange: "A welcome map unfolds and new pathways appear through the event.",
      },
      {
        id: "surprise",
        label: "Keep every activity a surprise to make the event exciting",
        feedback: "Surprises can be fun for some guests, but predictability helps others take part.",
        correct: false,
      },
      {
        id: "separate",
        label: "Create one separate activity for neurodivergent guests",
        feedback: "A separate experience can reduce belonging. Design flexible options for everyone.",
        correct: false,
      },
    ],
  },
  "harbour-team-day": {
    skill: "Match strengths to purpose",
    title: "Build a meaningful team",
    scenario: (context) =>
      `In ${context}, Jordan is highly accurate with stock checks but finds rapid customer conversations tiring.`,
    instruction: "Assign work by strengths while keeping growth and choice open.",
    successMessage: "Jordan owns a valuable role and the whole team sees ability in action.",
    options: [
      {
        id: "strength-role",
        label: "Offer the stock role and ask what support would help with other tasks",
        feedback: "Strength-based work can be meaningful without limiting future opportunities.",
        correct: true,
        sceneChange: "The team board updates and every strength connects to a real outcome.",
      },
      {
        id: "no-work",
        label: "Avoid assigning responsibility because mistakes would be risky",
        feedback: "Low expectations deny meaningful work before ability has been considered.",
        correct: false,
      },
      {
        id: "customer-only",
        label: "Assign customer service because everyone must rotate equally",
        feedback: "Identical assignments are not always equitable. Start with strengths and consent.",
        correct: false,
      },
    ],
  },
};

export function getSkillMission(stop: TrailStop, role: LearnerRole): SkillMission {
  const template = missionTemplates[stop.id] ?? missionTemplates["san-po-kong-sport"];
  return {
    ...template,
    scenario: template.scenario(learnerRoles[role].context),
  };
}
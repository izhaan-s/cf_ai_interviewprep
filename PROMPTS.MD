# AI Prompts

# AI-Assisted Development Prompts

This section documents prompts used with AI coding assistants (Claude/Cursor) to build this application.

## Initial Setup

**Prompt:**
```
Lets use shadcn and spice this form up please. split into components and hooks if need be!
```

**Result:** Created structured form with `useInterviewForm` hook and `InterviewForm` component using shadcn/ui components (Input, Select, Textarea, Button).

## Design System Implementation

**Prompt:**
```
Lets create a design file with all of cloudflare theme colours for our design import into global.css
```

**Result:** 
- Updated `globals.css` with Cloudflare orange (`hsl(16 100% 60%)`) as primary color
- Changed font from Geist to Inter
- Updated all component themes
- Created gradient backgrounds with orange tints

## Frontend-Backend Integration

**Prompt:**
```
okay lets do this and when we click start interview prep send a request to backend /prep api. ye?
```

**Result:**
- Created Next.js API route proxy at `/api/prep/route.ts`
- Updated `useInterviewForm` hook with fetch logic
- Added loading states and error handling
- Implemented navigation to interview page with sessionId

## Interview Page Development

**Prompt:**
```
Now lets create a interview page based on @DESIGN.md. Pass in the session_id as a prop that we get from the post request and use the endpoints from backend to load the questions + criteria and do the full loop!
```

**Result:**
- Created `/interview/[sessionId]/page.tsx` with dynamic routing
- Implemented `useInterview` hook for state management
- Built question/answer loop:
  - QuestionCard component
  - AnswerInput component with submission
  - EvaluationCard component with color-coded ratings
  - Progress tracking and navigation
- Created API proxy routes for `/api/session/[sessionId]` and `/api/answer`
- Built results page at `/interview/[sessionId]/results`

---
Used AI to help track previous prompts ^^
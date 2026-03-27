import { useReducer } from 'react';
import { AssessmentState, AssessmentAction } from '@/types/assessment';
import { calculateResults } from '@/data/scoring';
import { dimensions } from '@/data/dimensions';

const initialState: AssessmentState = {
  phase: 'landing',
  companyProfile: null,
  currentQuestion: 0,
  answers: {},
  results: null,
};

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case 'START_SETUP':
      return { ...state, phase: 'setup' };

    case 'COMPLETE_SETUP':
      return {
        ...state,
        phase: 'assessing',
        companyProfile: action.profile,
        currentQuestion: 0,
        answers: {},
      };

    case 'ANSWER_QUESTION':
      return {
        ...state,
        answers: { ...state.answers, [action.dimensionId]: action.level },
      };

    case 'NEXT_QUESTION': {
      const nextQ = state.currentQuestion + 1;
      if (nextQ >= dimensions.length) {
        const results = calculateResults(
          state.answers,
          state.companyProfile?.industry || 'other'
        );
        return { ...state, phase: 'results', results };
      }
      return { ...state, currentQuestion: nextQ };
    }

    case 'SHOW_EMAIL_CAPTURE':
      return { ...state, phase: 'emailCapture' };

    case 'COMPLETE_EMAIL':
      return { ...state, phase: 'thankYou' };

    case 'RESTART':
      return initialState;

    default:
      return state;
  }
}

export function useAssessmentState() {
  return useReducer(assessmentReducer, initialState);
}


import { useState } from 'react';
import { matchCareers, getMatchReasons, type Career } from './careerData';

export type MessageType = 'bot' | 'user' | 'options' | 'careers' | 'summary';

export interface Message {
  id: string;
  type: MessageType;
  text: string;
  options?: string[];
  careers?: Career[];
  subjects?: string[];
  interests?: string[];
  workingStyles?: string[];
}

export interface ChatState {
  messages: Message[];
  userInput: string;
  currentStep: string;
  subjects: string[];
  interests: string[];
  workingStyles: string[];
  goals: string;
  recommendedCareers: Career[];
  isTyping: boolean;
  conversationEnded: boolean;
}

export type ChatAction = 
  | { type: 'USER_MESSAGE'; payload: string }
  | { type: 'BOT_MESSAGE'; payload: string }
  | { type: 'OPTIONS_MESSAGE'; payload: { text: string; options: string[] } }
  | { type: 'SELECT_OPTION'; payload: string }
  | { type: 'ADD_SUBJECT'; payload: string }
  | { type: 'ADD_INTEREST'; payload: string }
  | { type: 'ADD_WORKING_STYLE'; payload: string }
  | { type: 'SET_GOALS'; payload: string }
  | { type: 'SHOW_CAREERS' }
  | { type: 'SHOW_SUMMARY' }
  | { type: 'ASK_FOLLOWUP'; payload: string }
  | { type: 'HANDLE_FOLLOWUP'; payload: string }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'RESTART_CONVERSATION' };

export const initialState: ChatState = {
  messages: [{
    id: '1',
    type: 'bot',
    text: 'Hello! I\'m CareerGuide, your AI career advisor designed to help secondary school students in Uganda discover suitable career paths. I\'ll ask you a few questions about your interests and strengths to suggest careers that might be a good match for you. Ready to begin?'
  }],
  userInput: '',
  currentStep: 'greeting',
  subjects: [],
  interests: [],
  workingStyles: [],
  goals: '',
  recommendedCareers: [],
  isTyping: false,
  conversationEnded: false
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'USER_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            type: 'user',
            text: action.payload
          }
        ],
        userInput: ''
      };
    
    case 'BOT_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            type: 'bot',
            text: action.payload
          }
        ],
        isTyping: false
      };
    
    case 'OPTIONS_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            type: 'options',
            text: action.payload.text,
            options: action.payload.options
          }
        ],
        isTyping: false
      };
    
    case 'SELECT_OPTION':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            type: 'user',
            text: action.payload
          }
        ]
      };
    
    case 'ADD_SUBJECT':
      return {
        ...state,
        subjects: [...state.subjects, action.payload]
      };
    
    case 'ADD_INTEREST':
      return {
        ...state,
        interests: [...state.interests, action.payload]
      };
    
    case 'ADD_WORKING_STYLE':
      return {
        ...state,
        workingStyles: [...state.workingStyles, action.payload]
      };
    
    case 'SET_GOALS':
      return {
        ...state,
        goals: action.payload
      };
    
    case 'SHOW_CAREERS': {
      const recommendedCareers = matchCareers(
        state.subjects,
        state.interests,
        state.workingStyles
      );
      
      return {
        ...state,
        recommendedCareers,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            type: 'careers',
            text: 'Based on your responses, here are some career paths that might suit you:',
            careers: recommendedCareers,
            subjects: state.subjects,
            interests: state.interests,
            workingStyles: state.workingStyles
          }
        ],
        currentStep: 'recommendations',
        isTyping: false
      };
    }
    
    case 'SHOW_SUMMARY':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: Date.now().toString(),
            type: 'summary',
            text: 'Here\'s a summary of our career guidance session:',
            careers: state.recommendedCareers,
            subjects: state.subjects,
            interests: state.interests,
            workingStyles: state.workingStyles
          }
        ],
        conversationEnded: true,
        isTyping: false
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    
    case 'RESTART_CONVERSATION':
      return {
        ...initialState,
        messages: [{
          id: Date.now().toString(),
          type: 'bot',
          text: 'Hello again! I\'m ready to help you explore career options. Let\'s start fresh!'
        }]
      };
    
    default:
      return state;
  }
}

export const handleUserMessage = (
  message: string,
  state: ChatState,
  dispatch: React.Dispatch<ChatAction>
) => {
  dispatch({ type: 'USER_MESSAGE', payload: message });
  dispatch({ type: 'SET_TYPING', payload: true });
  
  setTimeout(() => {
    switch (state.currentStep) {
      case 'greeting':
        handleGreetingResponse(message, dispatch);
        break;
      case 'subjects':
        handleSubjectsResponse(message, state, dispatch);
        break;
      case 'interests':
        handleInterestsResponse(message, state, dispatch);
        break;
      case 'workingStyle':
        handleWorkingStyleResponse(message, state, dispatch);
        break;
      case 'goals':
        handleGoalsResponse(message, state, dispatch);
        break;
      case 'recommendations':
        handleFollowupQuestions(message, state, dispatch);
        break;
      default:
        dispatch({
          type: 'BOT_MESSAGE',
          payload: "I'm not sure how to respond to that. Let's continue with our career exploration."
        });
    }
  }, 500);
};

const handleGreetingResponse = (
  message: string,
  dispatch: React.Dispatch<ChatAction>
) => {
  const normalizedMessage = message.toLowerCase();
  
  if (normalizedMessage.includes('yes') || 
      normalizedMessage.includes('ready') || 
      normalizedMessage.includes('ok') || 
      normalizedMessage.includes('start') || 
      normalizedMessage.includes('sure')) {
    
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "Great! Let's start by understanding your academic strengths. Which subjects are you strongest in or enjoy the most at school?"
    });
    
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "For example: Mathematics, Biology, English Literature, Computer Studies, etc. Please mention 2-3 subjects."
    });
    
    return 'subjects';
  } else {
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "I understand you might need more time. When you're ready to explore career options, just let me know by saying 'ready' or 'start'."
    });
    return 'greeting';
  }
};

const handleSubjectsResponse = (
  message: string,
  state: ChatState,
  dispatch: React.Dispatch<ChatAction>
) => {
  const subjectKeywords = [
    'math', 'mathematics', 'physics', 'chemistry', 'biology', 
    'english', 'literature', 'history', 'geography', 'economics',
    'business', 'computer', 'ict', 'art', 'music', 'physical education',
    'agriculture', 'accounting', 'commerce', 'entrepreneurship'
  ];
  
  const messageWords = message.toLowerCase().split(/[\s,;]+/);
  const foundSubjects: string[] = [];
  
  messageWords.forEach(word => {
    subjectKeywords.forEach(subject => {
      if (word.includes(subject) || subject.includes(word)) {
        // Get the original case from the user's message
        const originalSubject = message.split(/[\s,;]+/).find(w => 
          w.toLowerCase().includes(subject) || subject.includes(w.toLowerCase())
        );
        
        if (originalSubject && !foundSubjects.includes(originalSubject)) {
          foundSubjects.push(originalSubject);
          dispatch({ type: 'ADD_SUBJECT', payload: originalSubject });
        }
      }
    });
  });
  
  if (foundSubjects.length === 0) {
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "I couldn't identify specific subjects from your response. Could you please mention your favorite school subjects more clearly? For example: Mathematics, Biology, Geography, etc."
    });
    return 'subjects';
  }
  
  dispatch({
    type: 'BOT_MESSAGE',
    payload: `Thank you for sharing! I've noted that you're strong in ${foundSubjects.join(', ')}. Now, I'd like to know about your personal interests.`
  });
  
  dispatch({
    type: 'BOT_MESSAGE',
    payload: "What activities or topics do you enjoy outside of school? For example: technology, helping people, business, sports, art, nature, etc."
  });
  
  return 'interests';
};

const handleInterestsResponse = (
  message: string,
  state: ChatState,
  dispatch: React.Dispatch<ChatAction>
) => {
  const interestKeywords = [
    'technology', 'computers', 'programming', 'science', 'research',
    'helping', 'teaching', 'medicine', 'health', 'business', 
    'leadership', 'art', 'design', 'music', 'sports', 'nature',
    'environment', 'animals', 'reading', 'writing', 'agriculture',
    'farming', 'making', 'building', 'fixing'
  ];
  
  const messageWords = message.toLowerCase().split(/[\s,;]+/);
  const foundInterests: string[] = [];
  
  messageWords.forEach(word => {
    interestKeywords.forEach(interest => {
      if (word.includes(interest) || interest.includes(word)) {
        // Get the original case from the user's message
        const originalInterest = message.split(/[\s,;]+/).find(w => 
          w.toLowerCase().includes(interest) || interest.includes(w.toLowerCase())
        );
        
        if (originalInterest && !foundInterests.includes(originalInterest)) {
          foundInterests.push(originalInterest);
          dispatch({ type: 'ADD_INTEREST', payload: originalInterest });
        }
      }
    });
  });
  
  if (foundInterests.length === 0) {
    const interests = message.split(/[,;]/).map(i => i.trim());
    interests.forEach(interest => {
      if (interest && interest.length > 2) {
        dispatch({ type: 'ADD_INTEREST', payload: interest });
        foundInterests.push(interest);
      }
    });
  }
  
  if (foundInterests.length === 0) {
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "I couldn't identify specific interests from your response. Could you please share what activities or topics you enjoy? For example: technology, helping people, business, etc."
    });
    return 'interests';
  }
  
  dispatch({
    type: 'BOT_MESSAGE',
    payload: `Great! I see you're interested in ${foundInterests.join(', ')}. Now, let's talk about how you prefer to work.`
  });
  
  dispatch({
    type: 'OPTIONS_MESSAGE',
    payload: {
      text: "Which of these working styles do you prefer? (You can select more than one)",
      options: [
        "Working with people",
        "Working with data/information",
        "Working with hands-on practical tasks",
        "Creative problem solving",
        "Leadership and organizing",
        "Technical and analytical tasks"
      ]
    }
  });
  
  return 'workingStyle';
};

const handleWorkingStyleResponse = (
  message: string,
  state: ChatState,
  dispatch: React.Dispatch<ChatAction>
) => {
  const styleKeywords = {
    'people': ['people', 'team', 'social', 'helping', 'teaching', 'communicating'],
    'data': ['data', 'information', 'research', 'analytical', 'computers'],
    'hands-on': ['hands-on', 'practical', 'making', 'building', 'physical'],
    'creative': ['creative', 'design', 'problem solving', 'innovation'],
    'leadership': ['leadership', 'organizing', 'managing', 'planning'],
    'technical': ['technical', 'details', 'precision', 'analysis']
  };
  
  const messageLower = message.toLowerCase();
  const foundStyles: string[] = [];
  
  Object.entries(styleKeywords).forEach(([style, keywords]) => {
    for (const keyword of keywords) {
      if (messageLower.includes(keyword)) {
        dispatch({ type: 'ADD_WORKING_STYLE', payload: style });
        foundStyles.push(style);
        break;
      }
    }
  });
  
  if (foundStyles.length === 0) {
    const styles = message.split(/[,;]/).map(s => s.trim());
    styles.forEach(style => {
      if (style && style.length > 2) {
        dispatch({ type: 'ADD_WORKING_STYLE', payload: style });
        foundStyles.push(style);
      }
    });
  }
  
  if (foundStyles.length === 0) {
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "I couldn't determine your preferred working style from that response. Could you please choose from these options: working with people, working with data, hands-on tasks, creative work, leadership, or technical tasks?"
    });
    return 'workingStyle';
  }
  
  dispatch({
    type: 'BOT_MESSAGE',
    payload: `Thank you! I've noted that you prefer ${foundStyles.join(', ')} work.`
  });
  
  dispatch({
    type: 'BOT_MESSAGE',
    payload: "Finally, do you have any specific future goals or dreams? This is optional, but it helps me provide better guidance."
  });
  
  return 'goals';
};

const handleGoalsResponse = (
  message: string,
  state: ChatState,
  dispatch: React.Dispatch<ChatAction>
) => {
  dispatch({ type: 'SET_GOALS', payload: message });
  
  dispatch({
    type: 'BOT_MESSAGE',
    payload: "Thank you for sharing your goals with me. I'm analyzing your responses to find suitable career paths for you..."
  });
  
  setTimeout(() => {
    dispatch({ type: 'SHOW_CAREERS' });
    
    setTimeout(() => {
      dispatch({
        type: 'BOT_MESSAGE',
        payload: "Feel free to ask me specific questions about these careers like 'How much does a Software Engineer earn?' or 'Which universities offer Medicine?' or 'Can I switch from arts to sciences?'"
      });
    }, 2000);
  }, 1500);
  
  return 'recommendations';
};

const handleFollowupQuestions = (
  message: string,
  state: ChatState,
  dispatch: React.Dispatch<ChatAction>
) => {
  const messageLower = message.toLowerCase();
  
  // Check for salary-related questions
  if (messageLower.includes('earn') || 
      messageLower.includes('salary') || 
      messageLower.includes('pay') || 
      messageLower.includes('money')) {
    
    let careerName = '';
    
    state.recommendedCareers.forEach(career => {
      if (messageLower.includes(career.name.toLowerCase())) {
        careerName = career.name;
      }
    });
    
    if (!careerName) {
      // Try to extract a career name from the message
      const careerNames = ['doctor', 'engineer', 'teacher', 'nurse', 'lawyer', 
                          'accountant', 'software', 'agricultural', 'entrepreneur', 'businessman'];
      
      for (const name of careerNames) {
        if (messageLower.includes(name)) {
          const matchedCareer = state.recommendedCareers.find(c => 
            c.name.toLowerCase().includes(name)
          );
          
          if (matchedCareer) {
            careerName = matchedCareer.name;
            break;
          }
        }
      }
    }
    
    if (careerName) {
      const career = state.recommendedCareers.find(c => c.name === careerName);
      if (career && career.averageSalary) {
        dispatch({
          type: 'BOT_MESSAGE',
          payload: `A ${careerName} in Uganda typically earns ${career.averageSalary}.`
        });
      } else {
        dispatch({
          type: 'BOT_MESSAGE',
          payload: `Salaries for ${careerName}s in Uganda vary widely depending on experience, location, and employer. Entry-level positions often start around 1-2 million UGX monthly, while experienced professionals can earn substantially more.`
        });
      }
      return 'recommendations';
    }
  }
  
  // Check for university-related questions
  if (messageLower.includes('university') || 
      messageLower.includes('college') || 
      messageLower.includes('school') || 
      messageLower.includes('study') ||
      messageLower.includes('where can i')) {
    
    let careerName = '';
    
    state.recommendedCareers.forEach(career => {
      if (messageLower.includes(career.name.toLowerCase())) {
        careerName = career.name;
      }
    });
    
    if (!careerName) {
      // Try to extract a career or course name from the message
      const keywords = ['medicine', 'engineering', 'teaching', 'nursing', 'law', 
                        'accounting', 'software', 'agriculture', 'business'];
      
      for (const keyword of keywords) {
        if (messageLower.includes(keyword)) {
          const matchedCareer = state.recommendedCareers.find(c => 
            c.name.toLowerCase().includes(keyword) || 
            c.description.toLowerCase().includes(keyword)
          );
          
          if (matchedCareer) {
            careerName = matchedCareer.name;
            break;
          }
        }
      }
    }
    
    if (careerName) {
      const career = state.recommendedCareers.find(c => c.name === careerName);
      if (career && career.universities && career.universities.length > 0) {
        dispatch({
          type: 'BOT_MESSAGE',
          payload: `For ${careerName}, you can study at: ${career.universities.join(', ')}.`
        });
      } else {
        dispatch({
          type: 'BOT_MESSAGE',
          payload: `For ${careerName}, top institutions in Uganda include Makerere University, Kyambogo University, Uganda Christian University, and Mbarara University of Science and Technology. Each has different entry requirements and program offerings.`
        });
      }
      return 'recommendations';
    }
  }
  
  // Check for questions about switching subjects
  if ((messageLower.includes('switch') || messageLower.includes('change')) && 
      (messageLower.includes('arts') || messageLower.includes('science'))) {
    
    dispatch({
      type: 'BOT_MESSAGE',
      payload: "Switching between arts and sciences is possible but challenging. If you're currently in S3 or below, you can easily change your subject combination when selecting for O-level. If you're in S4 or above, you may need to take additional classes or bridging courses. Some universities offer foundation courses for students switching streams. It's best to talk with your school's career counselor for specific advice about your situation."
    });
    return 'recommendations';
  }
  
  // Check for summary request
  if (messageLower.includes('summary') || 
      messageLower.includes('summarize') || 
      messageLower.includes('recap')) {
    
    dispatch({ type: 'SHOW_SUMMARY' });
    return 'summary';
  }
  
  // Check for restart request
  if (messageLower.includes('restart') || 
      messageLower.includes('start over') || 
      messageLower.includes('begin again')) {
    
    dispatch({ type: 'RESTART_CONVERSATION' });
    return 'greeting';
  }
  
  // If we couldn't match a specific question type
  dispatch({
    type: 'BOT_MESSAGE',
    payload: "I'm not sure I understood your question. You can ask about salaries (e.g., 'How much does a doctor earn?'), education paths (e.g., 'Where can I study nursing?'), or request a summary of our discussion. Would you like to know anything specific about the careers I suggested?"
  });
  return 'recommendations';
};

export function useChat() {
  const [state, setState] = useState<ChatState>(initialState);
  
  const dispatch = (action: ChatAction) => {
    switch (action.type) {
      case 'USER_MESSAGE':
        setState(prevState => {
          const newState = chatReducer(prevState, action);
          
          // After user message, transition to next step based on current step
          const nextStep = prevState.currentStep === 'greeting' ? 'subjects' :
                          prevState.currentStep === 'subjects' ? 'interests' :
                          prevState.currentStep === 'interests' ? 'workingStyle' :
                          prevState.currentStep === 'workingStyle' ? 'goals' : 
                          prevState.currentStep;
          
          return {
            ...newState,
            currentStep: nextStep
          };
        });
        break;
      default:
        setState(prevState => chatReducer(prevState, action));
    }
  };
  
  const sendMessage = (message: string) => {
    handleUserMessage(message, state, dispatch);
  };
  
  const selectOption = (option: string) => {
    dispatch({ type: 'SELECT_OPTION', payload: option });
    handleWorkingStyleResponse(option, state, dispatch);
  };
  
  return {
    state,
    sendMessage,
    selectOption,
    dispatch
  };
}

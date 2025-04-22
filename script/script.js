 const categories = [
      { id: "js", name: "Javascript Basic" },
      { id: "angular", name: "Angular Basic" },
      { id: "react", name: "React.js Advance" },
      { id: "flutter", name: "Flutter" },
    ];

    
    const questionsData = {
      js: [
        {
          question: "Which method can be used to round a number to the nearest integer in JavaScript??",
          options: ["Math.round()", "Math.ceil()", "Math.floor()"],
          answer: 0,
        },
        {
          question: "Which method converts JSON to a JavaScript object?",
          options: ["JSON.stringify()", "JSON.parse()", "JSON.objectify()", "JSON.convert()"],
          answer: 1,
        },
        {
          question: "Which keyword is used to declare a variable in ES6?",
          options: ["var", "let", "const", "All of the above"],
          answer: 3,
        },
      ],
      angular: [
        {
          question: "Which directive is used for two-way data binding in Angular?",
          options: ["*ngIf", "*ngFor", "[(ngModel)]", "[ngClass]"],
          answer: 2,
        },
        {
          question: "What is the purpose of Angular CLI?",
          options: ["Create Angular apps", "Manage dependencies", "Run tests", "All of the above"],
          answer: 3,
        },
        {
          question: "Which lifecycle hook is called after Angular has initialized all data-bound properties?",
          options: ["ngOnInit", "ngAfterViewInit", "ngOnChanges", "ngDoCheck"],
          answer: 0,
        },
      ],
      react: [
        {
          question: "What is JSX?",
          options: [
            "A JavaScript extension syntax",
            "A CSS preprocessor",
            "A database query language",
            "A React hook",
          ],
          answer: 0,
        },
        {
          question: "Which hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          answer: 1,
        },
        {
          question: "What does 'props' stand for in React?",
          options: [
            "Properties",
            "Prototypes",
            "Procedures",
            "Promises",
          ],
          answer: 0,
        },
      ],
      flutter: [
        {
          question: "Which language is used to write Flutter apps?",
          options: ["Java", "Kotlin", "Dart", "Swift"],
          answer: 2,
        },
        {
          question: "What widget is used for layout in Flutter?",
          options: ["Container", "Row", "Column", "All of the above"],
          answer: 3,
        },
        {
          question: "Which method is used to start a Flutter app?",
          options: ["runApp()", "startApp()", "initApp()", "launchApp()"],
          answer: 0,
        },
      ],
    };

    const app = document.getElementById("app");

    // State variables
    let selectedCategory = null;
    let questions = [];
    let currentQuestionIndex = 0;
    let timer = null;
    let timeLeft = 10;
    let score = 0;
    let unanswered = 0;
    let answers = []; // store user answers: null = unanswered, else index of chosen option

    // Render category selection page
    function renderCategorySelection() {
      app.innerHTML = `
        <h2 class="text-3xl font-extrabold text-[#222222] mb-6">
          Welcome to <span class="text-[#a83a57] font-extrabold">QUIZ<span class="font-extrabold">Mania</span></span>
        </h2>

        <div class="bg-[#e6e6d9] rounded-md p-4 mb-8 max-w-[480px]">
          <p class="text-[#3a3a3a] text-sm leading-relaxed">
            Please read all the rules about this quiz before you start.
          </p>
          <a href="#" class="text-[#a83a57] text-sm font-semibold mt-1 inline-block">Quiz rules</a>
        </div>

        <form id="categoryForm" class="max-w-[480px]">
          <label for="fullname" class="block text-xs font-semibold text-[#3a3a3a] mb-2">Full name</label>
          <input
            id="fullname"
            name="fullname"
            type="text"
            placeholder="Full name"
            class="w-full rounded border border-[#d9d9d0] bg-[#f0f0e4] text-[#a3a3a3] placeholder-[#a3a3a3] py-3 px-4 mb-8 focus:outline-none focus:ring-2 focus:ring-[#a83a57]"
            required
          />

          <fieldset>
            <legend class="text-xs font-semibold text-[#3a3a3a] mb-3">Please select topic to continue</legend>
            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
              ${categories
                .map(
                  (cat) => `
                <label class="flex items-center border border-[#d9d9d0] rounded-md py-3 px-4 cursor-pointer text-[#3a3a3a] text-sm">
                  <input type="radio" name="category" value="${cat.id}" class="mr-3" required />
                  ${cat.name}
                </label>
              `
                )
                .join("")}
            </div>
          </fieldset>

          <button
            type="submit"
            class="mt-8 bg-[#d99aa3] text-white font-semibold rounded-md py-3 px-6 w-max"
          >
            Start Quiz
          </button>
        </form>
      `;

      const categoryForm = document.getElementById("categoryForm");
      categoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(categoryForm);
        const fullname = formData.get("fullname").trim();
        const category = formData.get("category");
        if (!fullname || !category) return;
        selectedCategory = category;
        questions = questionsData[selectedCategory];
        currentQuestionIndex = 0;
        score = 0;
        unanswered = 0;
        answers = Array(questions.length).fill(null);
        renderQuizPage();
        startTimer();
      });
    }

    // Render quiz page for current question
    function renderQuizPage() {
      clearInterval(timer);
      timeLeft = 10;

      const q = questions[currentQuestionIndex];
      const totalQuestions = questions.length;

      app.innerHTML = `
        <div class="max-w-[480px]">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-[#222222]">Question ${currentQuestionIndex + 1} of ${totalQuestions}</h3>
            <div class="text-[#a83a57] font-semibold text-lg" id="timer">10s</div>
          </div>
          <p class="text-[#222222] text-lg mb-6">${q.question}</p>
          <form id="quizForm" class="space-y-4">
            ${q.options
              .map(
                (opt, i) => `
              <label class="flex items-center border border-[#d9d9d0] rounded-md py-3 px-4 cursor-pointer text-[#3a3a3a] text-sm">
                <input type="radio" name="answer" value="${i}" class="mr-3" ${
                  answers[currentQuestionIndex] === i ? "checked" : ""
                } />
                ${opt}
              </label>
            `
              )
              .join("")}
            <div class="mt-8 flex justify-end">
              <button type="button" id="nextBtn" class="bg-[#d99aa3] text-white font-semibold rounded-md py-3 px-6 w-max">
                ${currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </form>
        </div>
      `;

      document.getElementById("nextBtn").addEventListener("click", () => {
        submitAnswerAndNext();
      });

      document.getElementById("quizForm").addEventListener("change", (e) => {
        if (e.target.name === "answer") {
          answers[currentQuestionIndex] = parseInt(e.target.value);
        }
      });

      startTimer();
    }

    // Start or restart timer for current question
    function startTimer() {
      clearInterval(timer);
      timeLeft = 10;
      updateTimerDisplay();
      timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timer);
          // Mark unanswered if no answer selected
          if (answers[currentQuestionIndex] === null) {
            unanswered++;
          }
          moveToNextQuestion();
        }
      }, 1000);
    }

    // Update timer text
    function updateTimerDisplay() {
      const timerEl = document.getElementById("timer");
      if (timerEl) {
        timerEl.textContent = timeLeft + "s";
      }
    }

    // Submit current answer and move to next question or results
    function submitAnswerAndNext() {
      clearInterval(timer);
      // If no answer selected, count as unanswered
      if (answers[currentQuestionIndex] === null) {
        unanswered++;
      }
      moveToNextQuestion();
    }

    // Move to next question or show results if last question
    function moveToNextQuestion() {
      currentQuestionIndex++;
      if (currentQuestionIndex >= questions.length) {
        calculateScore();
        renderResultsPage();
      } else {
        renderQuizPage();
      }
    }

    // Calculate score based on answers
    function calculateScore() {
      score = 0;
      for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].answer) {
          score++;
        }
      }
    }

    // Render results page
    function renderResultsPage() {
      app.innerHTML = `
        <div class="max-w-[480px] text-center">
          <h2 class="text-3xl font-extrabold text-[#222222] mb-6">Quiz Results</h2>
          <p class="text-lg text-[#3a3a3a] mb-4">Number of correct answers: <span class="font-semibold text-[#a83a57]">${score}</span></p>
          <p class="text-lg text-[#3a3a3a] mb-8">Number of unanswered questions: <span class="font-semibold text-[#a83a57]">${unanswered}</span></p>
          <button id="restartBtn" class="bg-[#d99aa3] text-white font-semibold rounded-md py-3 px-6 w-max">
            Restart Quiz
          </button>
        </div>
      `;

      document.getElementById("restartBtn").addEventListener("click", () => {
        selectedCategory = null;
        questions = [];
        currentQuestionIndex = 0;
        score = 0;
        unanswered = 0;
        answers = [];
        renderCategorySelection();
      });
    }

    // Initial render
    renderCategorySelection();
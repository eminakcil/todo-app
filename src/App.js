import classNames from 'classnames'
import { useState, useRef, useMemo } from 'react'

// tasarım https://youtu.be/FU5OoexQfxU?t=1674
function App() {
  /**
   * @typedef {object} Todo
   * @property {number} id
   * @property {string} text
   * @property {boolean} done
   */

  /**
   * @typedef {object} MODES
   * @property {0} CREATE
   * @property {1} SEARCH
   */

  /** @type {MODES} */
  const MODES = {
    CREATE: 0,
    SEARCH: 1,
  }

  const [mode, setMode] = useState(MODES.CREATE)

  /** @param {MODES} mode */
  const changeMode = (mode) => {
    setMode(mode)
  }

  /** @type {[Todo[], React.Dispatch<React.SetStateAction<Todo[]>>]} */
  const [todoList, setTodoList] = useState([])

  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const [searchInputValue, setSearchInputValue] = useState('')

  const currentTodoList = useMemo(() => {
    if (mode === MODES.SEARCH)
      return todoList.filter((todo) => {
        if (searchInputValue === '') return true

        const indexOf = todo.text
          .toLocaleLowerCase('TR')
          .indexOf(searchInputValue.toLocaleLowerCase('TR'))
        return indexOf !== -1
      })
    return todoList
  }, [searchInputValue, todoList, mode, MODES.SEARCH])

  const createNewTodo = (text, done = false) => {
    const newTodo = {
      id: todoList.length + 1,
      text,
      done,
    }

    setTodoList((value) => [...value, newTodo])
  }

  const removeTodo = (id) => {
    setTodoList((value) => value.filter((todo) => todo.id !== id))
  }

  const toggleTodoStatus = (id) => {
    const todoIndex = todoList.findIndex((todo) => todo.id === id)
    const newTodoList = [...todoList]
    newTodoList[todoIndex].done = !newTodoList[todoIndex].done
    setTodoList(newTodoList)
  }

  const complateAllTodos = () => {
    const todoIdList = currentTodoList.map((todo) => todo.id)

    setTodoList((value) =>
      value.map((todo) => {
        const newTodo = { ...todo }

        if (todoIdList.includes(todo.id)) {
          newTodo.done = true
        }

        return newTodo
      })
    )
  }

  const removeAllTodos = () =>
    setTodoList((value) => {
      const todoIdList = currentTodoList.map((todo) => todo.id)

      return value.filter((todo) => !todoIdList.includes(todo.id))
    })

  /** @param {SubmitEvent} e */
  const onSubmit = (e) => {
    e.preventDefault()
    createNewTodo(inputValue)
    setInputValue('')
    inputRef.current.focus()
  }

  const onChange = (e) => {
    setInputValue(e.target.value)
  }

  const todoListView = (
    <div className="my-2">
      {currentTodoList.length === 0 ? (
        <div className="text-center p-[24px] text-gray-400">burada hiçbir şey yok :(</div>
      ) : (
        currentTodoList.map((todo) => (
          <div
            key={todo.id}
            className={classNames({
              'py-4 flex items-center border-b last:border-0 border-gray-300 px-3': true,
              'bg-green-200': todo.done,
            })}
          >
            <div className="flex-1 pr-8">
              <h3
                className={classNames({
                  'text-lg font-semibold': true,
                  'text-gray-900': !todo.done,
                  'text-green-800 line-through': todo.done,
                })}
              >
                {todo.text}
              </h3>
            </div>

            <div className="flex gap-4">
              <button
                className={classNames({
                  'py-2 px-2 text-white rounded-xl': true,
                  'bg-green-500': !todo.done,
                  'bg-red-500': todo.done,
                })}
                onClick={toggleTodoStatus.bind(this, todo.id)}
              >
                {todo.done ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              <button
                className="py-2 px-2 bg-red-500 text-white rounded-xl"
                onClick={removeTodo.bind(this, todo.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )

  const createForm = (
    <form className="flex flex-row gap-4" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Başlık"
        className="flex-1 py-3 px-4 focus:outline-0 bg-gray-100 rounded-xl"
        value={inputValue}
        onChange={onChange}
        ref={inputRef}
      />
      <button
        type="submit"
        className="w-14 py-3 bg-green-500 text-white rounded-xl flex justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
        disabled={inputValue.length === 0}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </form>
  )

  const searchForm = (
    <input
      type="text"
      placeholder="Ara"
      className="flex-1 py-3 px-4 focus:outline-0 bg-gray-100 rounded-xl"
      value={searchInputValue}
      onChange={(e) => setSearchInputValue(e.target.value)}
    />
  )

  return (
    <div className="bg-gray-200 p-4 min-h-full">
      <div className="lg:w-2/4 mx-auto py-8 px-6 bg-white rounded-xl">
        <h1 className="font-bold text-4xl text-center mb-8 text-gray-700">
          Emin's First Todo App
        </h1>
        <div className="mb-6 flex flex-col gap-3">
          <div className="flex flex-row gap-1">
            <button
              className={classNames({
                'p-3 bg-blue-500 text-white rounded-xl flex justify-center': true,
                'opacity-50': mode !== MODES.CREATE,
              })}
              onClick={changeMode.bind(this, MODES.CREATE)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              className={classNames({
                'p-3 bg-blue-500 text-white rounded-xl flex justify-center': true,
                'opacity-50': mode !== MODES.SEARCH,
              })}
              onClick={changeMode.bind(this, MODES.SEARCH)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
          {mode === MODES.SEARCH
            ? searchForm
            : mode === MODES.CREATE
            ? createForm
            : createForm}
        </div>
        <hr />
        {todoListView}
        <hr />
        <div className="flex flex-row gap-4 mt-6">
          <button
            className="flex-1 p-2 text-white rounded-xl bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentTodoList.every((todo) => todo.done)}
            onClick={complateAllTodos}
          >
            Tümünü Tamamla
          </button>
          <button
            className="flex-1 p-2 text-white rounded-xl bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentTodoList.length === 0}
            onClick={removeAllTodos}
          >
            Tümünü Kaldır
          </button>
        </div>
        <div className="mt-2 text-center text-gray-700">
          Toplam {todoList.length} öğeden {currentTodoList.length} tanesi listelendi
        </div>
      </div>
    </div>
  )
}

export default App

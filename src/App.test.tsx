import { render } from '@testing-library/react'
import App from './App'

describe('App scaffold', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })
})

import './css/Help.css';

const Help = () => {
  return (
    <div className="help-container">
      <h1>Help</h1>
      <section>
        <h2>Getting Started</h2>
        <p>Our app is designed for anonymous use, so you can start using it right away without creating an account or providing any personal information.</p>
      </section>
      <section>
        <h2>Key Features</h2>
        <ul>
          <li>
            <h3>Viewing Confessions</h3>
            <p>On the home page, you&apos;ll see a list of anonymous confessions submitted by users. Confessions are displayed in reverse chronological order, with the most recent ones at the top.</p>
          </li>
          <li>
            <h3>Creating a Confession</h3>
            <p>To submit your own confession, click on the &quot;Create&quot; button in the navigation bar. Type your confession in the text area provided and click &quot;Submit Confession&quot;. Your confession will be posted anonymously.</p>
          </li>
        </ul>
      </section>
      <section>
        <h2>Tips and Tricks</h2>
        <ul>
          <li>Keep your confessions concise and clear for better readability.</li>
          <li>Refresh the home page to see new confessions that have been posted.</li>
          <li>Remember that all confessions are anonymous, so don&apos;t include any identifying information in your posts.</li>
        </ul>
      </section>
      <section>
        <h2>Troubleshooting</h2>
        <p>If you encounter any issues while using the app:</p>
        <ul>
          <li>Try refreshing the page.</li>
          <li>Clear your browser cache and cookies.</li>
          <li>Ensure you have a stable internet connection.</li>
          <li>If problems persist, try using a different web browser.</li>
        </ul>
      </section>
    </div>
  )
}

export default Help

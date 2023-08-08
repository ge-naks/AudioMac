function Home() {

    return (
      <>
      <div className='authButton'>
      <button >Log In</button>
      <button >Sign Up</button>
      </div>
      <h1 className= 'title' style={{fontFamily: "Gasoek One", letterSpacing: '2.5px'}}>AudioMac</h1>
      <h2 className='sub'>Practice Mental Math in a Whole New Way</h2>
      <a href="/exp">
      <button className='titleButton'>Learn How</button>
      </a>
      </>
    )
  }
  
  export default Home

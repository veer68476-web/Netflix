import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useApp } from './context/appContext.js'
import { useAuth } from './context/authContext.js'
import Footer from './components/Footer.jsx'
import LoadingSpinner from './components/LoadingSpinner.jsx'
import Navbar from './components/Navbar.jsx'
import './App.css'

const ContinueWatching = lazy(() => import('./pages/ContinueWatching.jsx'))
const Home = lazy(() => import('./pages/Home.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const MovieDetails = lazy(() => import('./pages/MovieDetails.jsx'))
const Movies = lazy(() => import('./pages/Movies.jsx'))
const MyList = lazy(() => import('./pages/MyList.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))
const Profile = lazy(() => import('./pages/Profile.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const Signup = lazy(() => import('./pages/Signup.jsx'))
const TVShows = lazy(() => import('./pages/TVShows.jsx'))
const Watch = lazy(() => import('./pages/Watch.jsx'))
const NewAndPopular = lazy(() => import('./pages/NewAndPopular.jsx'))
const Profiles = lazy(() => import('./pages/Profiles.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Languages = lazy(() => import('./pages/Languages.jsx'))

function HomeRoute() {
  const { profile } = useApp()
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  return profile ? <Home /> : <Navigate to="/profiles" replace />
}

function ProfilesRoute() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  return <Profiles />
}

function InitialRoute() {
  const { profile } = useApp()
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={profile ? '/home' : '/profiles'} replace />
}

function AppLayout() {
  const { pathname } = useLocation()
  const immersive = pathname.startsWith('/watch/')
  const authPage = pathname === '/login' || pathname === '/signup'
  return <>
    {!immersive && !authPage && <Navbar />}
    <Suspense fallback={<LoadingSpinner label="Loading NEXFLIX" />}>
      <Routes>
        <Route path="/" element={<InitialRoute />} />
        <Route path="/home" element={<HomeRoute />} />
        <Route path="/profiles" element={<ProfilesRoute />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv" element={<Navigate to="/tv-shows" replace />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/genres" element={<Navigate to="/movies" replace />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/new-and-popular" element={<NewAndPopular />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/title/:id" element={<MovieDetails />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<MovieDetails />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/continue-watching" element={<ContinueWatching />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
    {!immersive && !authPage && <Footer />}
  </>
}

export default function App() {
  return <AppLayout />
}

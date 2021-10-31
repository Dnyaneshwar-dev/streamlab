import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as GiIcons from 'react-icons/gi';

export const SidebarData = [
  {
    title: 'HOME',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'CREATE',
    path: '/auditorium',
    icon: <GiIcons.GiTheater />,
    cName: 'nav-text'
  },
  {
    title: 'JOIN',
    path: '/join',
    icon: <GiIcons.GiTeamIdea />,
    cName: 'nav-text'
  },
  // {
  //   title: 'Groups',
  //   path: '/groups',
  //   icon: <IoIcons.IoMdPeople />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'MESSAGES',
  //   path: '/messages',
  //   icon: <FaIcons.FaEnvelopeOpenText />,
  //   cName: 'nav-text'
  // },
  // {
  //   title: 'SUPPORT',
  //   path: '/support',
  //   icon: <IoIcons.IoMdHelpCircle />,
  //   cName: 'nav-text'
  // }
];
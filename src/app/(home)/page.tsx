import HomeLayout from './layout';
import CategoryPage from './[id]/page';

const Homepage = () => {
  return (
    <HomeLayout>
      <CategoryPage params={{ id: 'All' }} />
    </HomeLayout>
  );
};

export default Homepage;

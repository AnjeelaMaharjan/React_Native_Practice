import { View, Text, ScrollView } from 'react-native';
import { withDrawer } from '../Drawer/DrawerHOC';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import SafeHeader from '../Header/SafeHeader';


const CATEGORIES = [
    {id:1, title: 'Trending', items: [{id: 'a', name: 'Trending Item 1'}, {id: 'b', name: 'Trending Item 2'}]},
    {id:2, title: 'New', items: [{id: 'c', name: 'New Item 1'}, {id: 'd', name: 'New Item 2'}]},
    {id:3, title: 'Top Rated', items: [{id: 'e', name: 'Top Rated Item 1'}, {id: 'f', name: 'Top Rated Item 2'}]},
    {id:4, title: 'Upcoming', items: [{id: 'g', name: 'Upcoming Item 1'}, {id: 'h', name: 'Upcoming Item 2'}]},
    {id:5, title: 'Classics', items: [{id: 'i', name: 'Classic Item 1'}, {id: 'j', name: 'Classic Item 2'}]},
    {id:6, title: 'Documentaries', items: [{id: 'k', name: 'Documentary Item 1'}, {id: 'l', name: 'Documentary Item 2'}]},
    {id:7, title: 'Sci-Fi', items: [{id: 'm', name: 'Sci-Fi Item 1'}, {id: 'n', name: 'Sci-Fi Item 2'}]},
    {id:8, title: 'Horror', items: [{id: 'o', name: 'Horror Item 1'}, {id: 'p', name: 'Horror Item 2'}]},
    {id:9, title: 'Comedy', items: [{id: 'q', name: 'Comedy Item 1'}, {id: 'r', name: 'Comedy Item 2'}]},
    {id:10, title: 'Action', items: [{id: 's', name: 'Action Item 1'}, {id: 't', name: 'Action Item 2'}]},
];// This is a sample data structure for categories and their items. You can replace it with your actual data source.

const CategoryScreen: React.FC = () => {
    return (
      
            <SafeAreaView style={{ flex: 1, padding: 16 }}  edges={['right'] }>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Categories</Text>
        <SafeHeader title="Categories" showDrawerButton={true} />

        <ScrollView>{/*Child render: Renders the horizontal list of items for each category*/}
            {CATEGORIES.map(category => (
                <View key={category.id} style={{ marginBottom: 20 }}>   
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{category.title}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {category.items.map(item => (
                            <View key={item.id} style={{ width: 120, height: 180, backgroundColor: '#ccc', marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>  
                                <Text>{item.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            ))}
        </ScrollView>   
            </SafeAreaView>
      

    );
}
export default withDrawer(CategoryScreen);
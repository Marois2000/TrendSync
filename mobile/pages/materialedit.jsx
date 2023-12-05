/**
 * @author Tyler Marois
 */
import { StyledView, StyledText, StyledScroll, StyledOpacity, StyledTextInput } from '../StyleWrappers';
import { FontAwesome, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-root-toast';

/**
 * @description Lets users edit materials for a job
 * 
 * @param {*} close Closes the page when set to false
 * @param {*} job The current job
 * @param {*} user The current user
 * 
 * @returns The material edit page
 */
export default MaterialEdit = ({ close, job, user }) => {
    const [unusedMaterials, setUnusedMaterials] = useState([]); // All the unused materials
    const [usedMaterials, setUsedMaterials] = useState([]); // The materials in use
    const [total, setTotal] = useState(0.00); // price of all the materials


    useEffect(() => {
        calculateTotal();
    }, [usedMaterials])

    useEffect(() => {
        changeScreenOrientation();
    })

    /**
     * @description Lock the screen to landscape
     */
    async function changeScreenOrientation() {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    }

    /**
     * @description Unlock the screens orientation
     */
    async function unlockScreen() {
        ScreenOrientation.unlockAsync();
        close();
    }

    useEffect(() => {
        getMaterials();
        getMaterialsUsed();
    }, []);

    /**
     * @description Get all possible materials
     */
    const getMaterials = async() => {

        const body = {
            jobId: job.job_id
        }
        
        try {
            const req = await fetch(path+"/trendsync/getmaterials", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();
            
            setUnusedMaterials(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description The materials the job is already using
     */
    const getMaterialsUsed = async() => {
        const body = {
            jobId: job.job_id
        }

        try {
            const req = await fetch(path+"/trendsync/getmaterialsinuse", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            const res = await req.json();
            
            setUsedMaterials(res);
        } catch (error) {
            console.log(error.message);
        }
    }

    /**
     * @description Add a material to the in use materials
     * 
     * @param {*} material The material to be added
     */
    const addMaterialToUsed = (material) => {
        const newMaterial = {
            job_id: job.job_id,
            material_id: material.material_id,
            name: material.name,
            quantity: 1,
            price: material.price
        }

        setUnusedMaterials(unusedMaterials.filter((unusedMaterial) => unusedMaterial != material));
        setUsedMaterials([... usedMaterials, newMaterial]);
    }

    /**
     * @description Updates a materials quantity on a job
     * 
     * @param {*} value the value to set quantity to
     * @param {*} index Index in the material array
     * @param {*} stepping If we are increasing with buttons
     * @param {*} stepper The value to step by
     */
    const setMaterialQuantity = (value, index, stepping, stepper) => {
        const materials = usedMaterials;
        if(isNaN(value)) {
            value = materials[index].quantity;
        } else if(value == "" || value < 0) {
            value = 0;
        }
        if(stepping) {
            if(materials[index].quantity + stepper > 0) {
                materials[index].quantity = Number(materials[index].quantity + stepper);
            }
        } else {
            materials[index].quantity = value;
        }
        setUsedMaterials([... materials]);
    }

    /**
     * @description Removes a material from the in use array
     * 
     * @param {*} material The material to be removed
     */
    const removeFromUsedMaterials = (material) => {
        const newMaterial = {
            material_id: material.material_id,
            name: material.name,
            price: material.price
        }

        setUsedMaterials(usedMaterials.filter((used) => used != material));
        setUnusedMaterials([...unusedMaterials, newMaterial]);
    }

    /**
     * @description The total of all the materials added up
     */
    const calculateTotal = () => {
        let cost = 0.00;
        usedMaterials.forEach(material => {
            cost += material.price * material.quantity;
        });

        const formattedDollarAmount = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(cost);

        setTotal(formattedDollarAmount);
    }

    /**
     * @description Call the API and set the jobs new materials
     */
    const updateMaterials = async() => {

        let materials = [];
        usedMaterials.forEach(material => {
            materials = [...materials, {
                job_id: material.job_id,
                material_id: material.material_id,
                quantity: material.quantity
            }]
        });

        const body = {
            jobId: job.job_id,
            materials: materials
        }
        

        try {
            Toast.show('Materials Saved!', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.TOP,
                backgroundColor: '#4BB543',
                opacity: 90,
            });
            
            const req = await fetch(path+"/trendsync/updatematerials", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });
            
            
            getMaterials();
            getMaterialsUsed();
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#F5F5F5", position: 'absolute', width: '100%', height: '100%', zIndex: 10}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
            <StyledView classes={["w:full", "justify:center", "items:end", "bg:background", "py:3", "px:10", "flex:row"]}>
                <StyledText classes={["flex:1", "text-align:center", "text:xl"]}>Materials</StyledText>
                <FontAwesome name="close" size={24} color="black" onPress={unlockScreen} />
            </StyledView>

            <StyledView classes={["flex:1", "w:full", "bg:background", "flex:row"]}>
                <StyledScroll classes={["flex:1", "bg:primary", "h:full"]} contentContainerStyle={{alignItems:'center'}}>
                    {unusedMaterials.map((material, index) => {
                        return(
                            <StyledView classes={["w:[80%]", "m:2", "p:2", "bg:primary2", "flex:row", "justify:between"]} key={index}>
                                <StyledText classes={["text:lg", "color:background", "text-align:left"]} >{material.name}</StyledText>
                                
                                {user.rank > 0 && !job.complete ? 
                                    <Entypo name="plus" size={24} color="#F5F5F5" onPress={() => addMaterialToUsed(material)} />
                                : null }
                            </StyledView>

                            
                        )
                    })}
                </StyledScroll>


                <StyledView classes={["flex:1", "bg:background", "h:full"]}>
                    <StyledScroll classes={["flex:1", "bg:background", "h:full"]} contentContainerStyle={{alignItems:'center'}}>
                        {usedMaterials.map((material, index) => {
                            return(
                                <StyledView classes={["w:[80%]", "m:2", "p:2", "bg:grey1", "flex:row", "justify:between", "items:center"]} key={index}>
                                    <StyledText classes={["text:lg", "color:primary", "text-align:left", "w:[40%]"]} key={index}>{material.name}</StyledText>

                                    {user.rank > 0 && !job.complete ? 
                                        <StyledView classes={["flex:row", "flex:1", "justify:center", "items:center"]}>
                                            <MaterialCommunityIcons name='chevron-left' size={24} color="#1B3F9C" onPress={() => setMaterialQuantity(1, index, true, -1)}/>
                                            <StyledTextInput value={`${material.quantity}`} onChangeText={(e) => setMaterialQuantity(e, index, false, 0)} keyboardType='numeric'  classes={["bg:grey2", "rounded:md", "p:1", "mx:3"]}/>
                                            <MaterialCommunityIcons name='chevron-right' size={24} color="#1B3F9C" onPress={() => setMaterialQuantity(1, index, true, 1)}/>
                                        </StyledView>
                                    : <StyledText classes={["bg:grey2", "rounded:md", "p:1", "mx:3"]}>{`${material.quantity}`}</StyledText> }

                                    {user.rank && !job.complete > 0 ? 
                                        <FontAwesome name="close" size={24} color="#1B3F9C" onPress={() => removeFromUsedMaterials(material)} />
                                    : null }
                                </StyledView>
                            )
                        })}
                    </StyledScroll>

                    <StyledView classes={["w:full", "bg:primary", "justify:around", "items:center", "p:4", "flex:row"]}>
                        <StyledView classes={["bg:primary2", "px:5", "py:2", "justify:between", "flex:row", "items:center", "w:[50%]"]}>
                            <StyledText classes={["color:background", "text:lg", "text-align:left"]}>Total</StyledText>
                            <StyledText classes={["color:background", "text:lg", "text-align:right"]}>{total}</StyledText>
                        </StyledView>
                        
                        {user.rank > 0 && !job.complete ? 
                            <StyledOpacity classes={["border:1", "px:5", "py:2", "border-color:background", "rounded:lg"]} onPress={updateMaterials}>
                                <StyledText classes={["color:background", "text:xl"]}>Save Changes</StyledText>
                            </StyledOpacity>
                        : null }

                    </StyledView>
                </StyledView>
                
            </StyledView>
        </KeyboardAvoidingView>
    )
}
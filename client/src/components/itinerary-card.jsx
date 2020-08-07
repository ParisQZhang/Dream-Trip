import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import useStyles from '../styles/detail-cards';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import '../styles/detail-cards.css';

export default function ItineraryCard({
  imgUrl,
  name,
  address,
  price,
  rating,
  removePlace,
  id,
  tripDuration,
  assignDay,
  assignedDay,
}) {
  const classes = useStyles();
  const deletePlace = () => {
    removePlace(id);
  };

  const duration = tripDuration();
  const days = [];

  for (let i = 0; i <= duration; i++) {
    days.push(i + 1);
  }

  const handleChange = (event) => {
    const newDay = event.target.value;
    console.log('id', id, 'day', newDay);
    assignDay(newDay, id);
  };

  return (
    <div className="detail-card">
      <Card className={classes.root}>
        <IconButton aria-label="delete" className={classes.margin}>
          <DeleteIcon fontSize="small" onClick={deletePlace} />
        </IconButton>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              {name}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {address}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              $: {price}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              <span role="img" aria-label="star">
                ⭐️
              </span>
              : {rating}
            </Typography>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="outlined-age-native-simple">DAY</InputLabel>
              <Select
                native
                value={assignedDay}
                onChange={handleChange}
                label="Day"
              >
                <option aria-label="None" value="" />
                {days.map((day) => {
                  return <option value={day}>{day}</option>;
                })}
              </Select>
            </FormControl>
          </CardContent>
        </div>
        <CardMedia
          className={classes.cover}
          image={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${imgUrl}&key=${process.env.REACT_APP_API_KEY}`}
          title={name}
        />
      </Card>
    </div>
  );
}
